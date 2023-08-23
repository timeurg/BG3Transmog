const fs = require('fs');
const path = require('node:path');
console.log('start', process.argv);
console.log('USAGE', `node .dig.js x find Hat
node .dig.js distinct using
node .dig.js lsxlocate edb7385a-e4d4-4fb7-ad9f-a9910e4b9e97
node .dig.js all
`);



const pathGameAssets = [
    'D:\\Games\\bg3GameLite\\Shared\\Public\\Shared\\Stats\\Generated\\Data\\Armor.txt',
    'D:\\Games\\bg3GameLite\\Shared\\Public\\SharedDev\\Stats\\Generated\\Data\\Armor.txt',
    'D:\\Games\\bg3GameLite\\Gustav.pak\\Public\\Gustav\\Stats\\Generated\\Data\\Armor.txt',
    'D:\\Games\\bg3GameLite\\Gustav.pak\\Public\\GustavDev\\Stats\\Generated\\Data\\Armor.txt'
];
const pathMod = [
    `D:\\Games\\bg3mods\\BG3Transmog\\Public\\BG3Transmog\\Stats\\Generated`
]

const pathTest = [
    `C:\\SteamLibrary\\steamapps\\common\\Baldurs Gate 3\\Data\\Public\\BG3Transmog\\Stats\\Generated`
]

const dbResorces = pathGameAssets;
const targetResources = pathMod;

let lsx_locate = (uuid) =>
    dbResorces.map(p => {
        const filename = (path.dirname(p) + '/../../../RootTemplates/' + uuid + '.lsx');
        return fs.existsSync(filename) ? filename : ''
    }).filter(i => i != '').join(';')


let db = initDb();

console.log('Items in db', db.length);



const commands = {
    help: () =>
        `        


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
    lsx_locate,
    lsx_ls: () => {
        return db.map(i => i.RootTemplate ? {
            ...i,
            __loc__: lsx_locate(i.RootTemplate)
        } : null).filter(i => i && i.__loc__ != '')
    },
    lsx: (uuid) => {
        let file = lsx_locate(uuid);
        if (file) {
            return fs.readFileSync(file, 'utf-8')
        }
    },
    head,
    body,
    legs,
    all

}

function all() {
    fs.writeFileSync(`${targetResources[0]}\\TreasureTable.txt`,
    `new treasuretable "DEN_Entrance_Trade"
CanMerge 1`);
    let res1 = head();
    let res = [res1.length + ' of heads']
    res1 = body();
    res = [...res, res1.length + ' of bodies']
    res1 = legs();
    res = [...res, res1.length + ' of legs']
    return res
}

let args, command;
if (process.argv[2] == 'x') {
    command = process.argv[3];
    args = process.argv.splice(4);
    db = commands['lsx_ls']();
    console.log('Items in db', db.length);
} else {
    command = process.argv[2];
    args = process.argv.splice(3);
}
if (commands[command] instanceof Function) {
    let result = commands[command](...args)
    console.log(result)
    console.log(command, 'exited');
    if (result instanceof Array) {
        console.log(result.length, 'rows')
    }
}

function head () {
    db = commands['lsx_ls']();
    let helmets = [
        ...commands.find('Helm'),
        ...commands.find('Hat'),
        ...commands.find('Head'),
        ...commands.find('Mask'),
        ...commands.find('Scarf'),
        // ...commands.find('Helm'),
    ];
    helmets = helmets.sort((a,b)=> a.name > b.name)
    // return  helmets.filter((i,k) => helmets[k+1] && i.name == helmets[k+1].name ? console.log(i,helmets[k+1]) : null);
    fs.unlinkSync(`${targetResources[0]}\\Data\\Helmets.txt`);
    fs.writeFileSync(`${targetResources[0]}\\Data\\Helmets.txt`,'')

    helmets.map(i => {
        fs.appendFileSync(
        `${targetResources[0]}\\Data\\Helmets.txt`, 
        `
new entry "${i.name}_UNDERWEAR"
using "_Head"
data "Slot" "Underwear"
data "RootTemplate" "${i.RootTemplate}"
data "Weight" "0.01"
data "Rarity" "Legendary"
`
        );
        fs.appendFileSync(
        `${targetResources[0]}\\TreasureTable.txt`, 
            `
new subtable "1,1"
object category "I_${i.name}_UNDERWEAR",1,0,0,0,0,0,0,0`
        );
    }
    );
    return helmets;
}

function body () {
    db = commands['lsx_ls']();
    let helmets = [
        ...commands.find('Cloth'),
        ...commands.find('Robe'),
        ...commands.find('Body'),
        ...commands.find('fffff'),
        // ...commands.find('Helm'),
        // ...commands.find('Helm'),
    ];
    // return helmets;
    fs.unlinkSync(`${targetResources[0]}\\Data\\Body.txt`);
    fs.writeFileSync(`${targetResources[0]}\\Data\\Body.txt`,'')
    helmets.map(i => {
        fs.appendFileSync(
        `${targetResources[0]}\\Data\\Body.txt`, 
        `
new entry "${i.name}_CAMP"
using "ARM_Camp_Body"
data "Slot" "VanityBody"
data "RootTemplate" "${i.RootTemplate}"
data "ObjectCategory" "ClothingCommon"
data "Weight" "0.01"
data "Rarity" "Legendary"

new entry "${i.name}_CAMP2"
using "ARM_Camp_Body"
data "Slot" "VanityBody"
data "RootTemplate" "${i.RootTemplate}"
data "ObjectCategory" "ClothingRich"
data "Weight" "0.01"
data "Rarity" "Legendary"
`
        );
        fs.appendFileSync(
        `${targetResources[0]}\\TreasureTable.txt`, 
            `
new subtable "1,1"
object category "I_${i.name}_CAMP",1,0,0,0,0,0,0,0`
        );
    }
    );
    return helmets;
}

function legs () {
    db = commands['lsx_ls']();
    let helmets = [
        ...commands.find('Boot'),
        ...commands.find('Shoes'),
        ...commands.find('fffff'),
        // ...commands.find('Helm'),
        // ...commands.find('Helm'),
    ];
    if(fs.existsSync(`${targetResources[0]}\\Data\\Legs.txt`)) fs.unlinkSync(`${targetResources[0]}\\Data\\Legs.txt`);
    fs.writeFileSync(`${targetResources[0]}\\Data\\Legs.txt`,'')
    helmets.map(i => {
        fs.appendFileSync(
        `${targetResources[0]}\\Data\\Legs.txt`, 
        `
new entry "${i.name}_CAMPBOOT"
using "ARM_Camp_Shoes"
data "RootTemplate" "${i.RootTemplate}"
data "ObjectCategory" "ShoesCommon"
data "Weight" "0.01"
data "Rarity" "Legendary"

new entry "${i.name}_CAMPBOOT2"
using "ARM_Camp_Shoes"
data "RootTemplate" "${i.RootTemplate}"
data "ObjectCategory" "ShoesRich"
data "Weight" "0.01"
data "Rarity" "Legendary"
`
        );
        fs.appendFileSync(
        `${targetResources[0]}\\TreasureTable.txt`, 
            `
new subtable "1,1"
object category "I_${i.name}_CAMPBOOT",1,0,0,0,0,0,0,0`
        );
    }
    );
    return helmets;
}

function initDb() {
    let armor = dbResorces.map(p => fs.readFileSync(p, 'utf8')).join();
    armor = armor.split("\r\n\r\n");
    return armor
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
    }).filter(i => i);
}