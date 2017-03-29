## tdd-suite

#### Motivation

Javascript configuration of tests always hard. This project provides to test javascript codes on Electron Browser by --rendered parameters.
You can tests on existing adapter like Mocha or you can write new adapter to test with other libraries.

#### [Type Docs](https://wasabi-io.github.io/tdd-suite)

#### Test Modes , 
    - Test on Node 
    - Test on Browser just once 
    - Test on Browser as interactive
    
#### Add Custom Adapters.

#### Mocha Test

* NodeJS Test on Mocha Adapter
```ssh
    node ./node_modules/tdd-suite/bin/tdd-suite --opts mocha.opts --root-list src
```

#### Contribute

* Before Start Project

```ssh
$ git clone https://github.com/wasabi-io/tdd-suite.git`
$ cd tdd-suite
$ npm install
```

* run test

```ssh
$ npm test
```

* run coverage

```ssh
$ npm run coverage
```


* export docs

```ssh
$ npm run docs
```

* build code as javascript (common-js)

```ssh
$ npm build
```
