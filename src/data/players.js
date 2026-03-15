const players = [
    {
        name: "Sergio Ramos",
        goals: 145,
        assists: 45,
        name2: "Ramos",
        image: require("../../assets/icons_processed/processed_Ramos.png")
    },
    {
        name : "Andres Iniesta",
        goals: 106,
        assists: 167,
        name2: "Iniesta",
        image: require("../../assets/icons_processed/processed_Iniesta.png")
    },
    {
        name: "Mohamed Salah",
        goals: 379,
        assists: 150,
        name2: "Salah",
        image: require("../../assets/icons_processed/processed_Salah.png")
    },
    {
        name: "Wayne Rooney",
        goals: 363,
        assists: 229,
        name2: "Rooney",
        image: require("../../assets/icons_processed/processed_Rooney.png")
    },
    {
        name: "Antonio Rudiger",
        goals: 35,
        assists: 12,
        name2: "Rudiger",
        image: require("../../assets/icons_processed/processed_Rudiger.png")
    },
    {
        name: "Pele",
        goals: 757,
        assists: 350,
        name2: "Pele",
        image: require("../../assets/icons_processed/processed_Pele.png")
    },
    {
        name: "Mohamed Elneny",
        goals: 30,
        assists: 30,
        name2: "ElNeny",
        image: require("../../assets/icons_processed/processed_ElNeny.png")
    },
    {
        name: "Thiago Alcantara",
        goals: 67,
        assists: 102,
        name2: "Alcantara",
        image: require("../../assets/icons_processed/processed_Alcantara.png")
    },
    {
        name: "Roberto Carlos",
        goals: 112,
        assists: 101,
        name2: "Carlos",
        image: require("../../assets/icons_processed/processed_Carlos.png")
    },
    {
        name: "Vini Jr",
        goals: 154,
        assists: 82,
        name2: "Vini",
        image: require("../../assets/icons_processed/processed_Vini.png")
    },
    {
        name: "Zlatan Ibrahimovic",
        goals: 579,
        assists: 163,
        name2: "Ibrahimovic",
        image: require("../../assets/icons_processed/processed_Ibrahimovic.png")
    },
    {
        name: "Andrey Robertson",
        goals: 25,
        assists: 70,
        name2: "Robertson",
        image: require("../../assets/icons_processed/processed_Robertson.png")
    },
    {
        name: "Lionel Messi",
        goals: 858,
        assists: 380,
        name2: "Messi",
        image: require("../../assets/icons_processed/processed_Messi.png")
    },
    {
        name: "Xavi",
        goals: 125,
        assists: 260,
        name2: "Xavi",
        image: require("../../assets/icons_processed/processed_Xavi.png")
    },
    {
        name: "Cristiano Ronaldo",
        goals: 931,
        assists: 262,
        name2: "Ronaldo",
        image: require("../../assets/icons_processed/processed_Ronaldo.png")
    },
    {
        name: "Luka Modric",
        goals: 134,
        assists: 170,
        name2: "Modric",
        image: require("../../assets/icons_processed/processed_Modric.png")
    },
    {
        name: "David Silva",
        goals: 167,
        assists: 254,
        name2: "Silva",
        image: require("../../assets/icons_processed/processed_Silva.png")
    },
    {
        name: "Rivaldo",
        goals: 426,
        assists: 220,
        name2: "Rivaldo",
        image: require("../../assets/icons_processed/processed_Rivaldo.png")
    },
    {
        name: "Riyad Mahrez",
        goals: 219,
        assists: 187,
        name2: "Mahrez",
        image: require("../../assets/icons_processed/processed_Mahrez.png")
    },
    {
        name: "Genarro Gattuso",
        goals: 19,
        assists: 30,
        name2: "Gattuso",
        image: require("../../assets/icons_processed/processed_Gattuso.png")
    },
    {
        name: "Kylian Mbappe",
        goals: 375,
        assists: 200,
        name2: "Mbappe",
        image: require("../../assets/icons_processed/processed_Mbappe.png")
    },
    {
        name: "Salem Al-Dawsari",
        goals: 134,
        assists: 60,
        name2: "Dawsari",
        image: require("../../assets/icons_processed/processed_Dawsari.png")
    },
    {
        name: "Puskás",
        goals: 760,
        assists: 120,
        name2: "Puskas",
        image: require("../../assets/icons_processed/processed_Puskas.png")
    },
    {
        name: "Ronald Araujo",
        goals: 16,
        assists: 5,
        name2: "Araujo",
        image: require("../../assets/icons_processed/processed_Araujo.png")
    },
    {
        name: "Kevin De Bruyne",
        goals: 183,
        assists: 313,
        name2: "DeBruyne",
        image: require("../../assets/icons_processed/processed_DeBruyne.png")
    },
    {
        name: "Erling Haaland",
        goals: 294,
        assists: 50,
        name2: "Haaland",
        image: require("../../assets/icons_processed/processed_Haaland.png")
    },
    {
        name: "Declan Rice",
        goals: 35,
        assists: 43,
        name2: "Rice",
        image: require("../../assets/icons_processed/processed_Rice.png")
    },
    {
        name: "Robert Lewandowski",
        goals: 709,
        assists: 81,
        name2: "Lewandowski",
        image: require("../../assets/icons_processed/processed_Lewandowski.png")
    },
    {
        name: "Tony Kross",
        goals: 85,
        assists: 160,
        name2: "Kross",
        image: require("../../assets/icons_processed/processed_Kross.png")
    },
    {
        name: "Trent Alexander-Arnold",
        goals: 30,
        assists: 92,
        name2: "Arnold",
        image: require("../../assets/icons_processed/processed_Arnold.png")
    },
    {
        name: "Romelu Lukaku",
        goals: 402,
        assists: 100,
        name2: "Lukaku",
        image: require("../../assets/icons_processed/processed_Lukaku.png")
    },
    {
        name: "Rodri",
        goals: 38,
        assists: 70,
        name2: "Rodri",
        image: require("../../assets/icons_processed/processed_Rodri.png")
    },
    {
        name: "Karim Benzema",
        goals: 506,
        assists: 220,
        name2: "Benzema",
        image: require("../../assets/icons_processed/processed_Benzema.png")
    },
    {
        name: "Achraf Hakimi",
        goals: 52,
        assists: 50,
        name2: "Hakimi",
        image: require("../../assets/icons_processed/processed_Hakimi.png")
    },
    {
        name: "Neymar",
        goals: 459,
        assists: 230,
        name2: "Neymar",
        image: require("../../assets/icons_processed/processed_Neymar.png")
    },
    {
        name: "Ruud Gullitt",
        goals: 237,
        assists: 170,
        name2: "Gullitt",
        image: require("../../assets/icons_processed/processed_Gullitt.png")
    },
    {
        name: "Virgil Van Djik",
        goals: 65,
        assists: 30,
        name2: "VanDjik",
        image: require("../../assets/icons_processed/processed_VanDjik.png")
    },
    {
        name: "Patrick Vieira",
        goals: 65,
        assists: 80,
        name2: "Vieira",
        image: require("../../assets/icons_processed/processed_Vieira.png")
    },
    {
        name: "Diego Maradona",
        goals: 357,
        assists: 240,
        name2: "Maradona",
        image: require("../../assets/icons_processed/processed_Maradona.png")
    },
    {
        name: "Zinedine Zidane",
        goals: 160,
        assists: 178,
        name2: "Zidane",
        image: require("../../assets/icons_processed/processed_Zidane.png")
    },
    {
        name: "Rodrygo",
        goals: 98,
        assists: 60,
        name2: "Rodrygo",
        image: require("../../assets/icons_processed/processed_Rodrygo.png")
    },
    {
        name: "Casemiro",
        goals: 72,
        assists: 56,
        name2: "Casemiro",
        image: require("../../assets/icons_processed/processed_Casemiro.png")
    },
    {
        name: "Cafu",
        goals: 69,
        assists: 96,
        name2: "Cafu",
        image: require("../../assets/icons_processed/processed_Cafu.png")
    },
    {
        name: "Sadio Mane",
        goals: 278,
        assists: 140,
        name2: "Mane",
        image: require("../../assets/icons_processed/processed_Mane.png")
    },
    {
        name: "Andrea Pirlo",
        goals: 102,
        assists: 160,
        name2: "Pirlo",
        image: require("../../assets/icons_processed/processed_Pirlo.png")
    },
    {
        name: "Luis Suarez",
        goals: 592,
        assists: 268,
        name2: "Suarez",
        image: require("../../assets/icons_processed/processed_Suarez.png")
    },
    {
        name: "Ronald Koeman",
        goals: 254,
        assists: 90,
        name2: "Koeman",
        image: require("../../assets/icons_processed/processed_Koeman.png")
    },
    {
        name: "Johan Cruyff",
        goals: 436,
        assists: 230,
        name2: "Cruyff",
        image: require("../../assets/icons_processed/processed_Cruyff.png")
    },
    {
        name: "Joao Cancelo",
        goals: 35,
        assists: 70,
        name2: "Cancelo",
        image: require("../../assets/icons_processed/processed_Cancelo.png")
    },
    {
        name: "Cody Gakpo",
        goals: 116,
        assists: 51,
        name2: "Gakpo",
        image: require("../../assets/icons_processed/processed_Gakpo.png")
    },
    {
        name: "Sergio Busquets",
        goals: 22,
        assists: 87,
        name2: "Busquets",
        image: require("../../assets/icons_processed/processed_Busquets.png")
    },
    {
        name: "Michel Platini",
        goals: 354,
        assists: 200,
        name2: "Platini",
        image: require("../../assets/icons_processed/processed_Platini.png")
    },
    {
        name: "Heung-min Son",
        goals: 283,
        assists: 142,
        name2: "Son",
        image: require("../../assets/icons_processed/processed_Son.png")
    },
    {
        name: "Ngolo Kante",
        goals: 32,
        assists: 61,
        name2: "Kante",
        image: require("../../assets/icons_processed/processed_Kante.png")
    },
    {
        name: "Minamino",
        goals: 151,
        assists: 80,
        name2: "Minamino",
        image: require("../../assets/icons_processed/processed_Minamino.png")
    },
    {
        name: "Gerd Muller",
        goals: 679,
        assists: 173,
        name2: "Muller",
        image: require("../../assets/icons_processed/processed_Muller.png")
    },
    {
        name: "Josef Bichan",
        goals: 915,
        assists: 223,
        name2: "Bichan",
        image: require("../../assets/icons_processed/processed_Bichan.png")
    },
    {
        name: "Romario",
        goals: 768,
        assists: 210,
        name2: "Romario",
        image: require("../../assets/icons_processed/processed_Romario.png")
    }
]

export {players};