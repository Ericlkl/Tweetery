// Import Modules
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Load the enviroment variables
require('dotenv').config();

// Use IBM library for processing analysis
var NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');
var nlu = new NaturalLanguageUnderstandingV1({
  // Use API key
  iam_apikey: process.env.IBM_KEY,
  version: '2018-04-05',

  // API endpoint
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});
