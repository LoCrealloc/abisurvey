# Abisite

This is a small side project we created to easily manage surveys for our A-level magazine.
Some members of our team wanted to give sheets to all 120 students to answer the questions, but I was not quite interested in reading through about 1000 answers...

Since I started this project, my team decided that I should also implement some other features. This website is now able to:

- Collect surveys in the most elegant way possible
- Ensure the authenticity of votes using a registration system
- Collect funny or interesting quotes told by teachers and/or other students
- Collect profiles of students, including a variable number of pictures
- Redirect the user to a third party website for even more image collection

## Using the project

### Using docker

The easiest way to run this project is to use the `docker-compose.yml` file located in this repository. It provides you the latest stable version of this project as well as a postgres database that this project relies on.
In order to run the project, you will also have to set a few environment variables, which are explained later in this document. The easiest way is to just download or copy the example `abisite.env` file in this repository. After you downloaded both files, adjust the environment variables and the `docker-compose.yml` file to your needs and make sure you have Docker installed. You can then run the compose project with

```
docker compose up -d
```

### Running the project without docker

If you want to contribute to this project or just run the project locally, you can also run it via Vite.
You will have to clone the repository and cd into the newly created directory

```
git clone https://github.com/LoCrealloc/abisurvey
cd abisurvey
```

After that, you will have to install the project dependencies. Make sure you have Node and NPM installed.

```
npm install
```

After successfully installing the dependencies, copy the `abisite.env` file and adjust the copied file to your needs. You need to have a running Postgres instance in order to use the survey website.

```
cp abisite.env .env
vim .env
```

Once you have your database running and adjusted the environment file, you can run the website in a development environment using

```
npm run dev
```

## Environment variables

| **Variable**             | **Explanation**                                                                                           | **Example**                |
| ------------------------ | --------------------------------------------------------------------------------------------------------- | -------------------------- |
| DB_HOST                  | The IP address or hostname where the app can find the postgres database                                   | localhost                  |
| DB_PORT                  | The port the database is listening on                                                                     | 5432                       |
| DB_USER                  | The database user                                                                                         | abisurvey                  |
| DB_PASSWORD              | The password for the database user                                                                        | abisurvey                  |
| DB_NAME                  | The name of the database to be used for the apps data                                                     | abisurvey                  |
| SECRET                   | The secret used for signing the session cookies. Should be a long, randomly generated string              |                            |
| DEFAULT_ADMIN_PASSWORD   | The default admin password                                                                                | admin                      |
| FILE_SIZE_LIMIT          | The maximum size for user image uploads in bytes                                                          | 2000000000                 |
| PUBLIC_IMAGE_UPLOAD_LINK | A link pointing to a website where a user can upload different pictures, for example a nextcloud instance | https://upload.example.com |
| APP_PORT                 | The port the project is running on                                                                        | 3000                       |
| APP_HOST                 | The host on that the app is listening on for new connections                                              | 0.0.0.0                    |
| APP_ORIGIN               | The full public url where the app is called on                                                            | https://example.com        |
| APP_PROTOCOL_HEADER      | Header that tells Sveltekit the protocol it was called with                                               | x-forwarded-proto          |
| APP_HOST_HEADER          | Header taht tells Sveltekit the host it was called on                                                     | x-forwarded-host           |

## Bug reporting

If you encounter any problems or bugs with this project, please create an issue for this repository on Github. I will try to help you as soon as possible.

## License

This project is licensed under the terms of the GNU General Public License v3.0 license. You can find a copy of this license in the `LICENSE` file.
