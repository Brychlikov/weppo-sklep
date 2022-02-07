# Projekt sklepu internetowego 

#### Autorzy
- Artur Krzyżyński
- Karolina Lubczańska
- Bogdan Rychlikowski

## Instancja hostowana na Heroku: [link](https://polar-refuge-61445.herokuapp.com/annonymous)

## Stos technologiczny
- Express
- PostgreSQL
- EJs

## Uruchamianie
Aplikacja potrzebuje następujących zmiennych środowiskowych:
`DATABASE_URL` - connection string do instancji PostgreSQL. Wymagane jest połączenie SSL.  
`COOKIE_SECRET` - do podpisywania ciastek

## Wyszukiwanie w języku polskim
Dla instalacji PostgreSQL niewspierających domyślnie full-text search po polsku, w folderze `sjp-postgres-gen` znajduje się skrypt taką możliwość dodający.

---

Do boilerplate'u dla express/ts użyliśmy [express-ts-template](https://github.com/greenroach/express-ts-template)