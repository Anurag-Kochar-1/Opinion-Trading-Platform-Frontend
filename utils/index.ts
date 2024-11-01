export function generateUsername(): string {
    const characters = [
        "Simran",
        "Raj",
        "Gabbar",
        "Mogambo",
        "Chulbul",
        "BabuBhaiya",
        "Circuit",
        "MunnaBhai",
        "Veeru",
        "Basanti",
        "Thanos",
        "IronMan",
        "Batman",
        "Joker",
        "Rocky",
        "Vijay",
        "Don",
        "Sherlock",
        "HarryPotter",
        "Neo"
    ];

    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    const randomNum = Math.floor(100 + Math.random() * 900);

    return `${randomCharacter}_${randomNum}`;
}

