#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
const graphqlLang = require('graphql/language');
const transformer = require('../compiler/transformer');
const reasonTransformer = require('../compiler/reason/transformer');
const reasonPrinter = require('../compiler/reason/printer');

const raw = fs.readFileSync(path.resolve(process.argv[2]), 'utf8');
const source = new graphqlLang.Source(raw);
const transformed = transformer(source);
const reason = reasonTransformer(transformed);
const printed = reasonPrinter(reason);

process.stdout.write(printed);
