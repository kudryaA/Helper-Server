# Helper-Server
Catalog with useful information for people
## API
All api returns info in formart {status, data, comment}
* POST /categories/add?name={}&detail={}&password={} - add category(need authorization).
* POST /categories - get all categories
* POST /answer/add?name={}&category={}&detail={}&photos=[]&files=[]&password={} - add answer(need authorization).
* POST /answers?category={} - get all answers in category.
* POST /file?path={} - get file by path (\\ -> /, \ -> /, / ->  %2f).
* POST /answer/delete?name={}&password={} - delete answer by name(need authorization).
* POST /category/delete?name={}&password={} - delete category by name and all answers from this category(need authorization).
## Instalation
1. Install Node.js from https://nodejs.org (i have used version 10.15.1)<br>
2. Go to terminal/cmd <br>
3. Clone git repository <br>
```
git clone https://github.com/kudryaA/Helper-Server
```
4. Go to project
```
cd Helper-Server
```
5. Delete git from project
```
rm -rf .git
rm -f .gitignore
```
6. Install npm dependencies
```
npm install
```
7. Configurate server(port, path to database, password)
```
node install
```
8. Start server
```
npm start
```
## Good luck
Anton Kudryavtsev kam123ua@gmail.com
