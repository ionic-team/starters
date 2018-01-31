# Ionic AWS Starter

This Ionic starter comes with a pre-configured [AWS Mobile Hub](https://aws.amazon.com/mobile/) project set up to use Amazon DynamoDB, S3, Pinpoint, and Cognito.

## Using the Starter

### Installing Ionic CLI 3.0

This starter project requires Ionic CLI 3.0, to install, run

```bash
npm install -g ionic@latest
```

Make sure to add `sudo` on Mac and Linux. If you encounter issues installing the Ionic 3 CLI, uninstall the old one using `npm uninstall -g ionic` first.

### Installing AWSMobile CLI

```
npm install -g awsmobile-cli
```

### Creating the Ionic Project

To create a new Ionic project using this AWS Mobile Hub starter, run

```bash
ionic start myApp aws
```

Which will create a new app in `./myApp`.

Once the app is created, `cd` into it:

```bash
cd myApp
```

### Creating AWS Mobile Hub Project

Init AWSMobile project 

```bash
awsmobile init

Please tell us about your project:
? Where is your project's source directory:  src
? Where is your project's distribution directory that stores build artifacts:  dist
? What is your project's build command:  npm run-script build
? What is your project's start command for local test run:  ionic serve

? What awsmobile project name would you like to use:  ...

Successfully created AWS Mobile Hub project: ...
```

Enable user-signin and database features

```bash
awsmobile features

? select features:
 ◉ user-signin
 ◉ user-files
 ◯ cloud-api
❯◉ database
 ◉ analytics
 ◉ hosting
```

Configure database, create a table with name `tasks`

```bash
awsmobile database configure

? Select from one of the choices below. Create a new table

Welcome to NoSQL database wizard
You will be asked a series of questions to help determine how to best construct your NoSQL database table.

? Should the data of this table be open or restricted by user? Open
? Table name tasks

 You can now add columns to the table.

? What would you like to name this column taskId
? Choose the data type string
? Would you like to add another column Yes
? What would you like to name this column userId
? Choose the data type string
? Would you like to add another column Yes
? What would you like to name this column category
? Choose the data type string
? Would you like to add another column Yes
? What would you like to name this column description
? Choose the data type string
? Would you like to add another column Yes
? What would you like to name this column created
? Choose the data type number
? Would you like to add another column No

... /* primary and sort key */

? Select primary key userId
? Select sort key taskId

... /* index */

? Add index Yes
? Index name DateSorted
? Select partition key userId
? Select sort key created
? Add index No
Table tasks saved
```

Finally push the changes to server side

```bash
awsmobile push
```

### Running the app

Now the app is configured and wired up to the AWS Mobile Hub and AWS services. To run the app in the browser, run

```bash
ionic serve
```

To run the app on device, first add a platform, and then run it:

```bash
ionic cordova platform add ios
ionic cordova run ios
```

Or open the platform-specific project in the relevant IDE:

```bash
open platforms/ios/MyApp.xcodeproj
```

### Hosting app on Amazon S3

Since your Ionic app is just a web app, it can be hosted as a static website in an Amazon S3 bucket.

```
npm run build
awsmobile publish
```
