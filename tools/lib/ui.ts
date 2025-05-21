import figlet from 'figlet';
import chalk from 'chalk';
import boxen from 'boxen';

export const logHeader = () => {
  const title = figlet.textSync('Chain Stalker', {
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
  });
  const boxed = boxen(chalk.cyan(title), {
    padding: 1,
    borderColor: 'green',
    borderStyle: 'round',
    align: 'center'
  });
  console.log(boxed);
};