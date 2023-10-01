import Corestore from 'corestore';
import Autobase from 'autobase';
import chalk from 'chalk';
import ram from 'random-access-memory';


// (1) Ordering Chat Messages
console.log(chalk.green('\n(1) Ordering Chat Messages\n'));
{
  // Create two chat users, each with their own Hypercores.
  const st = new Corestore(ram);
  const userA = st.get({name: 'UserX'});
  const userB = st.get({name: 'UserY'});

  // Make two Autobases with those two users as inputs.
  const baseA = new Autobase({
    inputs: [userA, userB],
    localInput: userA,
    autostart: true,
  });
  const baseB = new Autobase({
    inputs: [userA, userB],
    localInput: userB,
    autostart: true,
  });

  // Append chat messages and read them out again, using the default options.
  // This simulates two peers who are always completely up-to-date with each others messages.
  await baseA.append('A0: hello!');
  await baseB.append('B0: hi! good to hear from you');
  await baseA.append('A1: likewise. fun exercise huh?');
  await baseB.append('B1: yep. great time.');

  for await (const node of baseA.createCausalStream()) {
    console.log(node.value.toString());
  }

  console.log(chalk.bgGray('\n(1) READING VIEW A \n'));
  const viewA = baseA.view;
  await viewA.update();

  for (let i = 0; i < viewA.length; i++) {
    const node = await viewA.get(i);
    console.log(node.value.toString());
  }

  console.log(chalk.bgGray('\n(2) READING VIEW B \n'));
  const viewB = baseB.view;
  await viewB.update();

  for (let i = 0; i < viewB.length; i++) {
    const node = await viewB.get(i);
    console.log(node.value.toString());
  }

}
