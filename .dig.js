const fs = require('fs');
const path = require('node:path');

console.log('start', process.argv);

const categories = ['_Head', '_Hand', '_Back', ];

const paths = [
    'D:\\Games\\bg3GameLite\\Shared\\Public\\Shared\\Stats\\Generated\\Data\\Armor.txt',
    'D:\\Games\\bg3GameLite\\Shared\\Public\\SharedDev\\Stats\\Generated\\Data\\Armor.txt',
    'D:\\Games\\bg3GameLite\\Gustav.pak\\Public\\Gustav\\Stats\\Generated\\Data\\Armor.txt',
    'D:\\Games\\bg3GameLite\\Gustav.pak\\Public\\GustavDev\\Stats\\Generated\\Data\\Armor.txt'
];

let armor = paths.map(p => fs.readFileSync(p, 'utf8')).join();

armor = armor.split("\r\n\r\n");

function filter(haystack, needle) {
    return haystack.filter(s => s.indexOf(needle) != -1);
}

// console.log([{
//     e: 'new entry "ARM_Shoes_C"\r\n' +
//       'type "Armor"\r\n' +
//       'using "ARM_Shoes"\r\n' +
//       'data "RootTemplate" "10e07ff1-5586-44fb-b437-31db1f7748ec"',
//     name: 'ARM_Shoes_C',
//     type: 'Armor',
//     using: 'ARM_Shoes',
//     RootTemplate: '10e07ff1-5586-44fb-b437-31db1f7748ec'
//   },
//   {
//     e: 'new entry "ARM_Shoes_D"\r\n' +
//       'type "Armor"\r\n' +
//       'using "ARM_Shoes"\r\n' +
//       'data "RootTemplate" "85d78eab-e4ad-4f56-bfb3-87c6368f5b17"',
//     name: 'ARM_Shoes_D',
//     type: 'Armor',
//     using: 'ARM_Shoes',
//     }].filter(e => Object.keys(e).map(i => { 
//         console.log(e,i, e[i],  e[i].indexOf('10e07ff1'))
//         return e[i].indexOf('10e07ff1') !== 0}) //.reduce((a,b) => a || b)
//     )
// )
// return;
let db = armor
    .map(e => {
        let entry = {
            __raw__: e
        };
        e.split("\r\n").map(string => {
            ['new entry', 'type', 'using'].map(s => {
                if (string.indexOf(s) === 0) {
                    entry[s == 'new entry' ? 'name' : s] = string.replace(s, '').replaceAll(/\"/g, '').trim();
                }
            })
            if (string.indexOf('data') === 0) {
                let r = string.split(' ').map(s => s.replaceAll(/\"/g, '').trim());
                entry[r[1]] = r.splice(2).join().replaceAll("\"", '');
            }
        })
        return entry;
    });

console.log('Items in db', db.length);



const commands = {
    help: () =>
        `        
node .dig.js find Hat
node .dig.js distinct using
node .dig.js lsxlocate edb7385a-e4d4-4fb7-ad9f-a9910e4b9e97

`,
    find: (string) => db.filter(e => Object.keys(e).map(i => e[i].indexOf(string) !== -1).reduce((a, b) => a || b)),
    distinct: (field) => {
        let map = {};
        db.map(e => map[e[field]] = 1);
        return Object.keys(map);
    },
    fields: () => {
        let map = {};
        db.map(e => Object.keys(e).map(k => map[k] = 1));
        return Object.keys(map);
    },
    lsxlocate: (uuid) =>
        paths.map(p => {
            const filename = (path.dirname(p) + '/../../../RootTemplates/' + uuid + '.lsx');
            return fs.existsSync(filename) ? filename : ''
        }).filter(i => i != '').join(';'),
    lsx: (uuid) => {
        let file = commands.lsxlocate(uuid);
        if (file) {
            return fs.readFileSync(file, 'utf-8')
        }
    }
}


if (commands[process.argv[2]] instanceof Function) {
    let result = commands[process.argv[2]](...process.argv.splice(3));
    console.log(result)
    console.log(process.argv[2], 'exited');
    if (result instanceof Array) {
        console.log(result.length, 'rows')
    }
}

// let types = {};

// db.map(e => types[e.using] = 1);

// console.log('using', Object.keys(types))

// let res = '';

// for (item of categories){
//     res += filter(armor, item).map(s => s.replace(item + '"', item + `"    
// data "Slot" "Underwear"`)).join('\r\n\r\n');

//     // console.log(items, items.length)
// }

// fs.writeFileSync('.result',res)