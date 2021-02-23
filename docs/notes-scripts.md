# Notes + Scripts

A few general notes and scripts to help work with Rocket, Turbo, and other services.

## Update i18n Translations

To update our translation files for [vue-i18n](https://kazupon.github.io/vue-i18n/), get the path to the new translation files, and pass to NPM or Node script.

```bash
node ./scripts/updateTranslationFiles.js <path-to-new-translations-directory>
```
or

```bash
npm run update:translations <path-to-new-translations-directory>
```

This will pull in translation messages from the provided source and *add* them to the existing translation files. The script does not handle cleanup/translation removal. Consider adjusting.

#### Example

```bash
node ./scripts/updateTranslationFiles.js /Users/johndoe/Downloads/0a8b609b-5f94-4966-a456-f9a0f0604ac4
```

#### Note

Even though you can run this with NPM, it is a bit faster to run the script directly with Node.

## ReIndex Solr

- Clear Solr
```
curl "http://localhost:38983/solr/ATLASCOPCOCR/update/?commit=true&stream.body=<delete><query>*:*</query></delete>"
```
- Initialize ReIndex
```
curl -X "POST" "http://localhost:38161/api/message?destination=queue:%2F%2FindexService.request.Bulk.0" \
     -H "Content-Type: text/plain; charset=utf-8" \
     -u admin:admin \
     -d "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><indexServiceRequest tenantKey=\"All\" objectType=\"All\" operationType=\"0\" tenantPropMaxNumFieldsForIndexing=\"500000\" />"
```

## Apache/Turbo Proxy Error

If you're running Turbo outside of Docker and getting a proxy error when trying to bring up Rocket, run the following command from the `turbo/` directory. This will rebuild Turbo on your machine.

```
./mvnw clean spring-boot:run -Dspring.profiles.active=vm
```

## Enable Rocket Admin

After bringing up the API + DB with `./start.sh`, open your MySQL workbench of choice and run the following:

```
INSERT INTO dmotodev.USERGROUP_accessPrivileges (USERGROUP_id, accessPrivileges) VALUES (3, 76);
```

Alternatively, go to the `USERGROUP_accessPrivileges` table, and create a new row with the target user group id (if you're logging in as admin@atlas.com, the user group id is 3) in the first column and the value 76 in the second. 76 enables rocket admin.
