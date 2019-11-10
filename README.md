# max-midi-tools
## Install
1. Clone this repository 
```shell script
git clone https://github.com/szk2s/max-midi-tools.githttps://github.com/szk2s/max-midi-tools.git
```
1. Add `lib` folder to your Max search path.
## Development
1. Clone this repository
1. Install devDependencies
```
yarn
```
1. Replace the searchpath in your `maxproj`
```
sed -i.bk -e "s|~/repos/max-midi-tools|~/path/to/your/max-midi-tools|g" test/test.maxproj
```
