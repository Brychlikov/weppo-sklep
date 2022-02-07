# Projekt sklepu internetowego 
[link do repozytorium](https://github.com/Brychlikov/weppo-sklep/)

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
Do utworzenia/wyczyszczenia tabel służy skrypt `resetDb.sql`.  
Aplikacja potrzebuje następujących zmiennych środowiskowych:
`DATABASE_URL` - connection string do instancji PostgreSQL. Wymagane jest połączenie SSL.  
`COOKIE_SECRET` - do podpisywania ciastek

## Panel administracyjny
Panel dostępny jest po zalogowaniu jako administrator  
Login: `admin@admin.admin`  
Hasło: `admin`

## Wyszukiwanie w języku polskim
Dla instalacji PostgreSQL niewspierających domyślnie full-text search po polsku, w folderze `sjp-postgres-gen` znajduje się skrypt taką możliwość dodający.

---

Do boilerplate'u dla express/ts użyliśmy [express-ts-template](https://github.com/greenroach/express-ts-template)