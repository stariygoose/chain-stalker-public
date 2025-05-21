import chalk from 'chalk';
import { runSetup } from "./lib/run.js";


runSetup().catch((err) => {
	if (err instanceof Error && err.name === 'ExitPromptError') {
		console.error(chalk.red('❌ Setup was interrupted. No config was saved.\n'))
		process.exit(0);
	}
  console.error(chalk.red('❌ Setup failed:'), err);
  process.exit(1);
});
