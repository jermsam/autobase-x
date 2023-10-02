import Corestore from 'corestore';
import Autobase from 'autobase';
import chalk from 'chalk';
import ram from 'random-access-memory';


// (1) Ordering Chat Messages
console.log(chalk.green('\n(1) Ordering Chat Messages\n'));
{
  // Create two chat users, each with their own Hypercores.
  const st = new Corestore(ram);
  const userA = st.get({name: 'UserG'});
  const userB = st.get({name: 'UserH'});

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

  await baseB.append('B2: Welcome back sir')

  await viewA.update();

  for (let i = 0; i < viewA.length; i++) {
    const node = await viewA.get(i);
    console.log(node.value.toString());
  }

  await viewB.update();

  for (let i = 0; i < viewB.length; i++) {
    const node = await viewB.get(i);
    console.log(node.value.toString());
  }

  console.log({
    statusA: viewA.status,
    statusB: viewB.status,
  })
}

console.log('___________________________________')

// (2) Forks and Reordering
console.log(chalk.green('\n(2) Forks and Reordering\n'))
{
  // Create two chat users, each with their own Hypercores.
  const st = new Corestore(ram);
  const userA = st.get({name: 'userW'});
  const userB = st.get({name: 'userV'});

  // Make two Autobases with those two users as inputs.
  const baseA = new Autobase({
    inputs: [userA,userB],
    localInput: userA,
    autostart: true,
  })
  const baseB = new Autobase({
    inputs: [userA,userB],
    localInput: userB,
    autostart: true,
  })

  // Append chat messages and read them out again, manually specifying empty clocks.
  // This simulates two peers creating independent forks.
  await baseA.append('A0: hello! anybody home?', []) // An empty array as a second argument means "empty clock"
  await baseB.append('B0: hello! first one here.', [])
  await baseA.append('A1: hmmm. guess not.', [])
  await baseB.append('B1: anybody home?', [])


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

  await baseB.append('B2: Welcome back sir', [])

  await viewA.update();

  for (let i = 0; i < viewA.length; i++) {
    const node = await viewA.get(i);
    console.log(node.value.toString());
  }

  await viewB.update();

  for (let i = 0; i < viewB.length; i++) {
    const node = await viewB.get(i);
    console.log(node.value.toString());
  }

  console.log({
    statusA: viewA.status,
    statusB: viewB.status,
  })

}

console.log('___________________________________')

{
  // Create two chat users, each with their own Hypercores.
  const st = new Corestore(ram);
  const userA = st.get({name: 'UserM'});
  const userB = st.get({name: 'UserN'});

  // Make two Autobases with those two users as inputs.
  const baseA = new Autobase({
    inputs: [userA, userB],
    localInput: userA,
    // autostart: true,
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

  baseA.start({
    apply: async (view, batch) => {

      batch = batch.map(({ value }) => Buffer.from(value.toString('utf-8').toUpperCase(), 'utf-8'))
      await view.append(batch)
    }
  })

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

  await baseB.append('B2: Welcome back sir')

  await viewA.update();

  for (let i = 0; i < viewA.length; i++) {
    const node = await viewA.get(i);
    console.log(node.value.toString());
  }

  await viewB.update();

  for (let i = 0; i < viewB.length; i++) {
    const node = await viewB.get(i);
    console.log(node.value.toString());
  }

  console.log({
    statusA: viewA.status,
    statusB: viewB.status,
  })
}