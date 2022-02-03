#! /bin/bash

if ! command -v pg_config &> /dev/null
then 
    echo "zainstaluj pg_config, bez tego nie pójdzie"
    exit
fi

iconv -f ISO_8859-2 -t utf-8 polish.aff > polish.affix
iconv -f ISO_8859-2 -t utf-8 polish.all > polish.dict
wget https://raw.githubusercontent.com/dominem/stopwords/master/polish.stopwords.txt
mv polish.stopwords.txt polish.stop


sudo cp polish.affix `pg_config --sharedir`/tsearch_data/
sudo cp polish.dict `pg_config --sharedir`/tsearch_data/
sudo cp polish.stop `pg_config --sharedir`/tsearch_data/


psql <<EOF
CREATE TEXT SEARCH DICTIONARY pl_ispell (
  Template = ispell,
  DictFile = polish,
  AffFile = polish,
  StopWords = polish
);

CREATE TEXT SEARCH CONFIGURATION pl_ispell(parser = default);

ALTER TEXT SEARCH CONFIGURATION pl_ispell
  ALTER MAPPING FOR asciiword, asciihword, hword_asciipart, word, hword, hword_part
  WITH pl_ispell;
EOF
