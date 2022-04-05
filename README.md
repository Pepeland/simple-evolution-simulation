# Simple Evolution Simulation

This is a Zero-player game or some kind of simulation I made it for fun and to practice JavaScript.
Feel free to use this code and change it if you like, and let me see your code and your creativity.
You can see the demo by the below link:

https://simple-evolution-simulation.vercel.app/

### Natural Selection
> Natural selection is the differential survival and reproduction of individuals due to differences in phenotype. It is a key mechanism of evolution, the change in the heritable traits characteristic of a population over generations. (From Wikipedia)

This game is based on the Natural Selection theory of Charles Darwin, explaining that creatures with more adaptation to the environment will survive. In each reproduction, we have new features in our offspring. Features of offspring come from parents and random mutations.

For example, in this game, I've set eye and flagella as a feature. But you can program and add any feature that you like.
Creatures who have eyes can locate foods and mates, and creatures who have flagella can move faster, so creatures with these two features will survive finally and overcome other creatures.

The game starts with none of these features in creatures, but as we move forward and by mutations that occur in reproductions, some of the creatures get eyes, and some others get flagella, then they can find more foods and more mates for reproduction and move faster.

### Parameters of creatures in this game
- **Shape** (Species)
<br>Each shape can reproduce with the same shape
- **Color**
<br>Offsprings' color can be like their mother or their father or a mixture of both (the last one not implemented yet)
- **Eye**
<br>Appears in offspring by mutation (random) and the children of creatures who have an eye. Creatures with an eye can find foods and other mates within a specific radius. Otherwise, they move randomly.
- **Flagella**
<br>Appears in offspring by mutation (random) and the children of creatures who have flagella. Creatures with flagella can move faster towards foods and mates.
- **Gender**
<br>Males who have enough energy look for females to reproduce
- **Energy**
<br>Each creature has some energy, energy increases by eating food and decreases by passing time and reproduction. The maximum energy is 100. Creatures with less than 100 energy look for food otherwise turn around happily. Creatures with more than 50 energies first try to find a mate for reproduction but if they couldn't find any mate in their eyes radius they go for food.
- **Age**
<br>Each creature has an age between 2-4 minutes (Random) and then dies.

