vedo-cli-classifier
===================

A CLI utility to classify DataSift line delimited JSON, and output a JSON file ready to loaded in to the classifier: https://github.com/datasift/vedo-datascience-toolkit

Edit ```config.json``` to setup the available CLI options and corresponding label.

Run pointing to a line delimited JSON file: ```node app.json <my_input_json_file>``` and the script will output a JSON file with the following format:

```
{"interaction":{"content":"<interaction_content>","id":<interaction_id>},"label":"<config_label"}
```

### todo

 - add a cache so a user can continue, rather than restart