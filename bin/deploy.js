#!/usr/bin/env node

const { run } = require('../dist/deploy');
run().catch(e => console.error(e));
