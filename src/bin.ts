#!/usr/bin/env node
import { Command } from 'commander';
import { hello } from './index.js';

const program = new Command();

program
  .name('package-name')
  .description('DESCRIPTION')
  .version('1.0.0');

program
  .option('-d, --dir <dirs...>', 'Directory to search for files', ['.'])
  .option('--dest <file>', 'Destination file to save output')
  .action((options) => {
    const { dir, dest } = options;
    // hello(dir, dest);
    hello();
  });

program.parse();
