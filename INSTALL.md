<p align="center">
  <div align="center">
    <img src="./images/icon.svg" alt="Logo" style="width:25%">
  </div>
</p>

# Community Map Installation

The following are instructions for installing the software on your own web server.

## Requirements

The community map has been designed to be relatively easy to install on standard "vanilla" hardware and software platforms. We recommend using a standard "LAMP" stack that integrates support for Apache, SQL, and PHP. To set up your own instance, you will need the following items:

### 1. PHP 8.1+

Sharedigm uses Laravel10 which relies upon PHP 8.1 or later.

### 2. Web Server

This application requires Apache or another similar web server.

### 2. SQL Database

The data science map uses SQL for storing user, authentication, and academic information.  You can use any of a number of SQL databases including MySQL, MariaDB, SQLite, PostgreSQL, Microsoft SQL Server and others.

# Install the Client Code

## Move or Copy the Files

First, take a look in this repository's "src/client" folder.  There, you should see two subfolders:

1) datascience_map
This is the client software for a map which addresses a single community.

2) community_map
This is an example of a configuration for a multi-community map. Community maps may include a number of additional sub-communities.

For simplicity, we're going to start with the installation for the single community map.

Move or copy the files located in "/src/client/dastascience_map" directory to the document root of your web server.

## Set Storage Permissions

The application may sometimes have a need to write out temporary files, for example, log files or session files. It does this in the "services/storage" directory. Make sure that this directory is writable by your web server. On a unix system, make sure that the files in the web server folder are owned by the web server process (usually "apache") and set the permissions to make the directory writeable by the web server.

```
chown -R apache:apache /var/www/html
chmod -R 755 /var/www/html

```

# Install the Server Code

Next, we will install the code for the back end API services that the client uses.  This code is located in this repository in the "src/server" directory.

1) campus_map
This server is responsible for the data for the base map - buildings, parking lots, etc.

2) community_map
This server is responsible for the data for the community of people that inhabit the map.

Create an "api" directory inside of your document root where you copied the client files.   Move or copy the "campus_map" and "community_map" server directories inside of this "api" directory.

## Test the Code Installation

Once you have copied the files into your web server's document root folder, verify that your web server can access the files. 

# Set Up The Database

The community map uses a standard SQL database. To set up your database, perform the following steps:

## Locate the SQL Database Files

Inside of the /database directory, you should see the following two SQL files:

- campus_map_structure.sql
- campus_map_content.sql
- community_map_structure.sql

## Create a New Database

Using a database editor of your choice, create a two new databases:

- campus_map
- community_map

## Create Database Tables

Next, create the required database tables. To do this, open your new database and execute the SQL script: "structure.sql".   You should see a list of tables that have been created.
1. Create "campus_map" database.
2. Run "campus_map_structure.sql" and to create the campus map tables.
3. Create "community_map" database.
4. Run "community_map_structure.sql" to create the community map tables.

## Initialize the Database

Next, we'll initialize the database with the data that it needs to display the map.

1. Open the "campus_map" database.
2. Run "campus_map_content.sql" to populate this database with the campus buildings.

# Configure the Client Software

The client is the "front end" or "user interface" portion of the software that the user interacts with.  The client needs to be able to talk to the "back end" where data is stored and managed.  In order for the client to be able to talk to the server, the client may need to be configured.   The client configuration is stored in the file "config/config.json".

```
"servers": {
    "authentication": "/services/public/api",
    "web": "/services/public/api"
  }
```

# Configure the Server Software

To configure the server software, go to the "services" folder where you copied the web server files. Inside of this directory your should see a file called ".env.example". Copy this file to ".env" and open it in your text editor.

## Configure the App

1.  Set environment (optional)
Set the variable "APP_ENV" to either "dev" for development or "prod" for production.

```
APP_ENV=prod
```

## Configure the Database

The database is where your user account information and other data is stored.  Follow these steps to make sure that the application can communicate to the database properly.

1.  Set database name (optional)
Set the variable "DB_DATABASE" to the name of your database, which is most likely "biodata".  If you selected a different name for the database, then enter that name here.

2.  Set database username
Set the variable "DB_USERNAME" to your database username.  By default, databases are created with the username 'root'.

```
DB_USERNAME=root
```

3.  Set database password
Set the variable "DB_PASSWORD" to your database password.  By default, database passwords are set to 'root'.

```
DB_PASSWORD=root
```

## Test The Database Configuration

Once you have configured the database, you should be able to log in to the "admin" user account.  To test whether the database has been properly configured, open up the application in your web browser.   You should see "SignIn" and "SignUp" button in the upper right hand corner.

### Sign In
To sign in to the default "admin" account, click the "Sign In" button.  You should see a "Sign In" dialog box.  For the username, enter "admin".   For the password, also enter "admin".

### Checking For Errors
If you do not see the "Sign In" button when you load up the application in your web browser, then that means that something is not working with the back end server configuration.   To see what the error is, either look in your web browser's debugger or go to the logs folder.   The logs folder is located in:

```
services/storage/logs
```

## Configure Email

This application uses email to verify users when they register for new accounts and to reset passwords.  It also uses email as a mechanism for sharing files and to allow user feeback.

1.  Set mail host
Set the variable "MAIL_HOST" to the host name of your mail server.

```
MAIL_HOST=mail.mydomain.com
```

2.  Set mail username
Set the variable "MAIL_USERNAME" to the user to use for sending email messages.

```
MAIL_USERNAME=myusername
```

3.  Set mail password
Set the variable "MAIL_PASSWORD" to the password of the user to use for sending email messages.
```
MAIL_PASSWORD=mypassword
```

## Test the Mail Configuration

To test whether the mail configuration is functioning properly, we'll send a test email using the following steps:

1.  Log in to the admin user account
Log in to the default admin user account as before - username: root, password: root.

2.  Open Settings
Once you have logged in, click the "Settings" icon (the gears icon) on the top nav bar.

3.  Open Account Settings
Click the "Account" icon on the left sidebar.

4.  Enter Your Email Address.
Click the "Edit Account" button and enter your email address.

5. Send a Test Email
Log out and click the "Sign In" button on the top nav bar.  On the "Sign In" dialog box, click the "Request My Username" link underneath "Username".   Enter your email address.  It should send an email to your email account.

## Installing Multimedia Support

Once you have the software up and running, you will need to make sure that your web server has the appropriate multimedia support to take advantage of the application's image and video capabilities.

## Install Image Support

The application uses the Image Magick library to perform image manipulation and scaling. This is used to generate image thumbnails.  Most recent version of PHP already have ImageMagick pre-installed and configured so you may not need to perform this step.  To check if ImageMagick is already installed, take a look at [phpinfo.php](https://localhost/phpinfo.php) to see if ImageMagick is listed.

1.  Install the ImageMagick library
If ImageMagick is not installed on your system, follow the instructions on [imagemagick.org](https://imagemagick.org) to install ImageMagick on your particular platform.

2.  Install ImageMagick PHP library
You will also need to install support for PHP to access the ImageMagick library. You will need to find directions for your particular platform to do this. On CentOS / Linux, you would execute the following command, where XX is the major/minor version of PHP that you have installed:

```
yum install phpXX-imagick
yum install php-pecl-imagick
```

3.  Configure PHP to use ImageMagick
If your PHP is not configured to use ImageMagick and you have just installed the library using the instructions above, you will then need to configure PHP to know about ImageMagick.   To configure your PHP installation to use ImageMagick, open up your php.ini file and under the list of extensions, add the following line:

```
extension=imagick.so
```