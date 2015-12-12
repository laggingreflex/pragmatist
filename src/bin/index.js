import _ from 'lodash';
import P from 'bluebird';
import gulp from 'gulp';
import yargs from 'yargs';
import pragmatist from './..';

let argv,
    executeTaskNames,
    knownTaskNames;

argv = yargs
    .demand(1)
    .options({
        browser: {
            description: 'Uses es2015 Babel preset for the build.',
            type: 'boolean'
        },
        types: {
            description: 'Writes type assertions using the flow type annotations.',
            type: 'boolean'
        }
    })
    .argv;

pragmatist(gulp, {
    prefix: 'pragmatist:',
    forceLogging: true,
    browser: argv.browser,
    types: argv.types
});

knownTaskNames = _.keys(gulp.tasks);
executeTaskNames = argv._;

P
    .resolve(executeTaskNames)
    .map((taskName) => {
        let executeTaskName;

        executeTaskName = 'pragmatist:' + taskName;

        if (_.indexOf(knownTaskNames, executeTaskName) === -1) {
            throw new Error('"' + executeTaskName + '" task does not exist.');
        }

        return new P((resolve) => {
            gulp
                .start(executeTaskName)
                .on('task_stop', () => {
                    resolve();
                });
        });
    }, {
        concurrency: 1
    });
