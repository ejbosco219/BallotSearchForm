export interface BallotSheetItem {
  _id: string;
  nameprinted: string;
  registeredaddress: {
    streetNumber: string;
    streetName: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface Voter {
  _id: string;
  firstName: string;
  lastName: string;
  address: {
    streetNumber: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  voterId: string;
  partyAffiliation: string;
  status: string;
}

// Helper to generate more realistic data
const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle", "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa", "Edward", "Deborah", "Alexandra", "Alexander", "Alex", "Alexis", "Alice", "Alicia", "Allison", "Alyssa", "Amanda", "Amber", "Amelia", "Amy", "Andrea", "Angela", "Ann", "Anna", "Anne", "Annie", "April", "Ariana", "Ariel", "Arlene", "Ashley", "Audrey", "Autumn", "Ava", "Avery", "Bailey", "Barbara", "Beatrice", "Belinda", "Bella", "Bernadette", "Bernice", "Bertha", "Bessie", "Beth", "Bethany", "Betsy", "Betty", "Beverly", "Bianca", "Billie", "Blanche", "Bobbi", "Bonnie", "Brandi", "Brandy", "Brenda", "Briana", "Brianna", "Bridget", "Brittany", "Brittney", "Brooke", "Brooklyn", "Caitlin", "Caitlyn", "Callie", "Cameron", "Camilla", "Camille", "Candace", "Candice", "Candy", "Carla", "Carly", "Carmen", "Carol", "Carolyn", "Carrie", "Casey", "Cassandra", "Cassie", "Catherine", "Cathy", "Cecilia", "Celeste", "Celia", "Charlene", "Charlotte", "Chelsea", "Cheryl", "Cheyenne", "Chloe", "Christina", "Christine", "Christy", "Cindy", "Claire", "Clara", "Claudia", "Colleen", "Connie", "Constance", "Cora", "Corinne", "Courtney", "Cristina", "Crystal", "Cynthia", "Daisy", "Dana", "Danielle", "Darlene", "Dawn", "Deanna", "Debbie", "Deborah", "Debra", "Delores", "Deloris", "Denise", "Diana", "Diane", "Dianne", "Dixie", "Dolores", "Donna", "Dora", "Doreen", "Doris", "Dorothy", "Ebony", "Edith", "Edna", "Eileen", "Elaine", "Eleanor", "Elena", "Elisa", "Elisabeth", "Elise", "Elizabeth", "Ella", "Ellen", "Elsie", "Emily", "Emma", "Erica", "Erika", "Erin", "Ernestine", "Esther", "Ethel", "Eunice", "Eva", "Evelyn", "Faith", "Faye", "Felicia", "Fern", "Flora", "Florence", "Frances", "Francine", "Francis", "Gabriela", "Gabrielle", "Gail", "Gayle", "Genevieve", "Georgia", "Geraldine", "Gertrude", "Gina", "Ginger", "Gladys", "Glenda", "Gloria", "Grace", "Gretchen", "Gwen", "Gwendolyn", "Hailey", "Hannah", "Harriet", "Hattie", "Hazel", "Heather", "Heidi", "Helen", "Henrietta", "Hilary", "Hilda", "Holly", "Hope", "Ida", "Ila", "Imogene", "Ina", "Inez", "Irene", "Iris", "Irma", "Isabel", "Isabella", "Jackie", "Jacqueline", "Jacquelyn", "Jaime", "Jamie", "Jan", "Jana", "Jane", "Janet", "Janice", "Janie", "Janis", "Jasmine", "Jean", "Jeanette", "Jeannie", "Jenna", "Jennie", "Jennifer", "Jenny", "Jessica", "Jessie", "Jill", "Jo", "Joan", "Joann", "Joanna", "Joanne", "Jocelyn", "Jodi", "Jody", "Johanna", "Johnnie", "Josephine", "Joy", "Joyce", "Juanita", "Judith", "Judy", "Julia", "Julianne", "Julie", "June", "Kara", "Karen", "Kari", "Karla", "Katelyn", "Katherine", "Kathleen", "Kathryn", "Kathy", "Katie", "Katrina", "Kay", "Kayla", "Kelley", "Kelli", "Kellie", "Kelly", "Kelsey", "Kendra", "Kerry", "Kim", "Kimberly", "Kristen", "Kristin", "Kristina", "Kristine", "Kristy", "Krystal", "Kylie", "Lacey", "Ladonna", "Lana", "Latoya", "Laura", "Lauren", "Laurie", "Laverne", "Leah", "Leann", "Leanna", "Leanne", "Lee", "Leigh", "Lela", "Lena", "Leona", "Leslie", "Leticia", "Lila", "Lillian", "Lillie", "Linda", "Lindsay", "Lindsey", "Lisa", "Liz", "Liza", "Lizzie", "Lois", "Lola", "Lora", "Lorene", "Loretta", "Lori", "Lorraine", "Louise", "Lucille", "Lucinda", "Lucy", "Lula", "Luz", "Lydia", "Lynda", "Lynette", "Lynn", "Lynne", "Mabel", "Mable", "Madeline", "Mae", "Maggie", "Malia", "Mamie", "Mandy", "Marcella", "Marcia", "Margaret", "Margarita", "Margie", "Marguerite", "Maria", "Marian", "Marianne", "Marie", "Marilyn", "Marina", "Marion", "Marisa", "Marisol", "Marissa", "Marjorie", "Marla", "Marlene", "Marsha", "Martha", "Mary", "Maryann", "Maryanne", "Maryellen", "Marylou", "Matilda", "Mattie", "Maureen", "Maxine", "May", "Megan", "Meghan", "Melanie", "Melba", "Melinda", "Melissa", "Melody", "Mercedes", "Meredith", "Mia", "Michele", "Michelle", "Mildred", "Mindy", "Minnie", "Miranda", "Miriam", "Misty", "Mollie", "Molly", "Mona", "Monica", "Monique", "Morgan", "Muriel", "Myra", "Myrna", "Myrtle", "Nadine", "Nancy", "Naomi", "Natalie", "Natasha", "Nell", "Nellie", "Nettie", "Nichole", "Nicole", "Nikki", "Nina", "Nora", "Norma", "Ola", "Olive", "Olivia", "Ollie", "Opal", "Ora", "Paige", "Pam", "Pamela", "Pat", "Patricia", "Patsy", "Patti", "Patty", "Paula", "Paulette", "Pauline", "Pearl", "Peggy", "Penny", "Phyllis", "Polly", "Priscilla", "Rachael", "Rachel", "Ramona", "Raquel", "Rebecca", "Rebekah", "Regina", "Renee", "Rhonda", "Rita", "Roberta", "Robin", "Robyn", "Rochelle", "Rosa", "Rosalie", "Rose", "Rosemarie", "Rosemary", "Rosie", "Roxanne", "Ruby", "Ruth", "Sabrina", "Sally", "Samantha", "Sandra", "Sandy", "Sara", "Sarah", "Sasha", "Saundra", "Savannah", "Selena", "Shana", "Shannon", "Shari", "Sharon", "Sharron", "Shauna", "Shawn", "Shawna", "Sheena", "Sheila", "Shelby", "Shelia", "Shelley", "Shelly", "Sheri", "Sherri", "Sherrie", "Sherry", "Sheryl", "Shirley", "Silvia", "Simone", "Sofia", "Sondra", "onia", "Sonja", "Sonya", "Sophia", "Sophie", "Stacey", "Stacie", "Stacy", "Stefanie", "Stella", "Stephanie", "Sue", "Summer", "Susan", "Susana", "Susanna", "Susie", "Suzanne", "Sylvia", "Tabitha", "Tamara", "Tameka", "Tami", "Tamika", "Tammy", "Tanya", "Tara", "Tasha", "Teresa", "Teri", "Terra", "Terri", "Terry", "Tessa", "Thelma", "Theresa", "Therese", "Tia", "Tiffany", "Tina", "Toni", "Tonya", "Tracey", "Traci", "Tracie", "Tracy", "Tricia", "Trina", "Trisha", "Trudy", "Ursula", "Valarie", "Valerie", "Vanessa", "Velma", "Vera", "Verna", "Veronica", "Vicki", "Vickie", "Vicky", "Victoria", "Viola", "Violet", "Virginia", "Vivian", "Wanda", "Wendy", "Whitney", "Willa", "Willie", "Wilma", "Winifred", "Yolanda", "Yvette", "Yvonne", "Zelma"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Hamilton", "Polk", "Hammond", "Smithson", "Goncalves", "Abbott", "Acevedo", "Acosta", "Adams", "Adkins", "Aguilar", "Aguirre", "Albert", "Alexander", "Alford", "Allen", "Allison", "Alston", "Alvarado", "Alvarez", "Anderson", "Andrews", "Anthony", "Armstrong", "Arnold", "Ashley", "Atkins", "Atkinson", "Austin", "Avery", "Avila", "Ayala", "Ayers", "Bailey", "Baird", "Baker", "Baldwin", "Ball", "Ballard", "Banks", "Barber", "Barker", "Barlow", "Barnes", "Barnett", "Barr", "Barrera", "Barrett", "Barron", "Barry", "Bartlett", "Barton", "Bass", "Bates", "Battle", "Bauer", "Baxter", "Beach", "Bean", "Beard", "Beasley", "Beck", "Becker", "Bell", "Bender", "Benjamin", "Bennett", "Benson", "Bentley", "Benton", "Berg", "Berger", "Bernard", "Berry", "Best", "Bird", "Bishop", "Black", "Blackburn", "Blackwell", "Blair", "Blake", "Blanchard", "Blankenship", "Blevins", "Bolton", "Bond", "Bonner", "Booker", "Boone", "Booth", "Bowen", "Bowers", "Bowman", "Boyd", "Boyer", "Boyle", "Bradford", "Bradley", "Bradshaw", "Brady", "Branch", "Bray", "Brennan", "Brewer", "Bridges", "Briggs", "Bright", "Britt", "Brock", "Brooks", "Brown", "Browning", "Bruce", "Bryan", "Bryant", "Buchanan", "Buck", "Buckley", "Buckner", "Bullock", "Burch", "Burgess", "Burke", "Burks", "Burnett", "Burns", "Burris", "Burt", "Burton", "Bush", "Butler", "Byers", "Byrd", "Cabrera", "Cain", "Calderon", "Caldwell", "Calhoun", "Callahan", "Camacho", "Cameron", "Campbell", "Campos", "Cannon", "Cantrell", "Cantu", "Cardenas", "Carey", "Carlson", "Carney", "Carpenter", "Carr", "Carrillo", "Carroll", "Carson", "Carter", "Carver", "Case", "Casey", "Cash", "Castaneda", "Castillo", "Castro", "Cervantes", "Chambers", "Chan", "Chandler", "Chaney", "Chang", "Chapman", "Charles", "Chase", "Chavez", "Chen", "Cherry", "Christensen", "Christian", "Church", "Clark", "Clarke", "Clay", "Clayton", "Clements", "Clemons", "Cleveland", "Cline", "Cobb", "Cochran", "Coffey", "Cohen", "Cole", "Coleman", "Collier", "Collins", "Colon", "Combs", "Compton", "Conley", "Conner", "Conrad", "Contreras", "Conway", "Cook", "Cooke", "Cooley", "Cooper", "Copeland", "Cortez", "Cote", "Cotton", "Cox", "Craft", "Craig", "Crane", "Crawford", "Crosby", "Cross", "Cruz", "Cummings", "Cunningham", "Curry", "Curtis", "Dale", "Dalton", "Daniel", "Daniels", "Daugherty", "Davenport", "David", "Davidson", "Davis", "Dawson", "Day", "Dean", "Decker", "Dejesus", "Delacruz", "Delaney", "Deleon", "Delgado", "Dennis", "Diaz", "Dickerson", "Dickson", "Dillard", "Dillon", "Dixon", "Dodson", "Dominguez", "Donaldson", "Donovan", "Dorsey", "Dotson", "Douglas", "Downs", "Doyle", "Drake", "Dudley", "Duffy", "Duke", "Duncan", "Dunlap", "Dunn", "Duran", "Durham", "Dyer", "Eaton", "Edwards", "Elliott", "Ellis", "Ellison", "Emerson", "England", "English", "Erickson", "Espinoza", "Estes", "Estrada", "Evans", "Everett", "Ewing", "Farley", "Farmer", "Farrell", "Faulkner", "Ferguson", "Fernandez", "Ferrell", "Fields", "Figueroa", "Finch", "Finley", "Fischer", "Fisher", "Fitzgerald", "Fitzpatrick", "Fleming", "Fletcher", "Flores", "Flowers", "Floyd", "Flynn", "Foley", "Forbes", "Ford", "Foreman", "Foster", "Fowler", "Fox", "Francis", "Franco", "Frank", "Franklin", "Franks", "Frazier", "Frederick", "Freeman", "French", "Frost", "Fry", "Frye", "Fuentes", "Fuller", "Fulton", "Gaines", "Gallagher", "Gallegos", "Galloway", "Gamble", "Garcia", "Gardner", "Garner", "Garrett", "Garrison", "Garza", "Gates", "Gay", "Gentry", "George", "Gibbs", "Gibson", "Gilbert", "Giles", "Gill", "Gillespie", "Gilliam", "Gilmore", "Glass", "Glenn", "Glover", "Goff", "Golden", "Gomez", "Gonzales", "Gonzalez", "Good", "Goodman", "goodwin", "Gordon", "Gould", "Graham", "Grant", "Graves", "Gray", "Green", "Greene", "Greer", "Gregory", "Griffin", "Griffith", "Grimes", "Gross", "Guerra", "Guerrero", "Guthrie", "Gutierrez", "Guy", "Guzman", "Hahn", "Hale", "Haley", "Hall", "Hamilton", "Hammond", "Hampton", "Hancock", "Haney", "Hansen", "Hanson", "Hardin", "Harding", "Hardy", "Harmon", "Harper", "Harrell", "Harris", "Harrison", "Hart", "Hartman", "Harvey", "Hatfield", "Hawkins", "Hayden", "Hayes", "Haynes", "Hays", "Head", "Heath", "Hebert", "Henderson", "Hendricks", "Hendrix", "Henry", "Hensley", "Henson", "Herman", "Hernandez", "Herrera", "Herring", "Hess", "Hester", "Hewitt", "Hickman", "Hicks", "Higgins", "Hill", "Hines", "Hinton", "Hobbs", "Hodge", "Hodges", "Hoffman", "Hogan", "Holcomb", "Holden", "Holder", "Holland", "Holloway", "Holman", "Holmes", "Holt", "Hood", "Hooper", "Hoover", "Hopkins", "Hopper", "Horn", "Horne", "Horton", "House", "Houston", "Howard", "Howe", "Howell", "Hubbard", "Huber", "Hudson", "Huff", "Huffman", "Hughes", "Hull", "Humphrey", "Hunt", "Hunter", "Hurley", "Hurst", "Hutchinson", "Hyde", "Ingram", "Irwin", "Jackson", "Jacobs", "Jacobson", "James", "Jarvis", "Jefferson", "Jenkins", "Jennings", "Jensen", "Jimenez", "Johns", "Johnson", "Johnston", "Jones", "Jordan", "Joseph", "Joyce", "Joyner", "Juarez", "Justice", "Kane", "Kaufman", "Keith", "Keller", "Kelley", "Kelly", "Kemp", "Kennedy", "Kent", "Kerr", "Key", "Kidd", "Kim", "King", "Kinney", "Kirby", "Kirk", "Kirkland", "Klein", "Kline", "Knapp", "Knight", "Knowles", "Knox", "Koch", "Kramer", "Lamb", "Lambert", "Lancaster", "Landry", "Lane", "Lang", "Langley", "Lara", "Larsen", "Larson", "Lawrence", "Lawson", "Le", "Leach", "Leblanc", "Lee", "Leon", "Leonard", "Lester", "Levine", "Lewis", "Lindsay", "Lindsey", "Little", "Livingston", "Lloyd", "Logan", "Long", "Lopez", "Lott", "Love", "Lowe", "Lowery", "Lucas", "Luna", "Lynch", "Lynn", "Lyons", "Macdonald", "Macias", "Mack", "Madden", "Maddox", "Maldonado", "Malone", "Mann", "Manning", "Marks", "Marquez", "Marsh", "Marshall", "Martin", "Martinez", "Mason", "Massey", "Mathews", "Mathis", "Matthews", "Maxwell", "May", "Mayer", "Maynard", "Mayo", "Mays", "Mcbride", "Mccall", "Mccarthy", "Mccarty", "Mcclain", "Mcclure", "Mcconnell", "Mccormick", "Mccoy", "Mccray", "Mccullough", "Mcdaniel", "Mcdonald", "Mcdowell", "Mcfadden", "Mcfarland", "Mcgee", "Mcgill", "Mcgowan", "Mcguire", "Mcintosh", "Mcintyre", "Mckay", "Mckee", "Mckenzie", "Mckinney", "Mcknight", "Mclaughlin", "Mclean", "Mcleod", "Mcmahon", "Mcmillan", "Mcneil", "Mcpherson", "Meadows", "Medina", "Mejia", "Melendez", "Melton", "Mendez", "Mendoza", "Mercado", "Mercer", "Merrill", "Merritt", "Meyer", "Meyers", "Michael", "Middleton", "Miles", "Miller", "Mills", "Miranda", "Mitchell", "Molina", "Monroe", "Montgomery", "Montoya", "Moody", "Moon", "Mooney", "Moore", "Morales", "Moran", "Moreno", "Morgan", "Morin", "Morris", "Morrison", "Morrow", "Morse", "Morton", "Moses", "Mosley", "Moss", "Mueller", "Mullen", "Mullins", "Munoz", "Murphy", "Murray", "Myers", "Nash", "Navarro", "Neal", "Nelson", "Newman", "Newton", "Nguyen", "Nichols", "Nicholson", "Nielsen", "Nieves", "Nixon", "Noble", "Noel", "Nolan", "Norman", "Norris", "Norton", "Nunez", "Obrien", "Ochoa", "Oconnor", "Odom", "Odonnell", "Oliver", "Olsen", "Olson", "Oneal", "Oneil", "Orozco", "Orr", "Ortega", "Ortiz", "Osborn", "Osborne", "Owen", "Owens", "Pace", "Pacheco", "Padilla", "Page", "Palmer", "Park", "Parker", "Parks", "Parrish", "Parsons", "Pate", "Patel", "Patrick", "Patterson", "Patton", "Paul", "Payne", "Pearson", "Peck", "Pena", "Pennington", "Perkins", "Perry", "Peters", "Petersen", "Peterson", "Petty", "Phelps", "Phillips", "Pickett", "Pierce", "Pineda", "Pittman", "Pitts", "Pollard", "Poole", "Pope", "Porter", "Potter", "Potts", "Powell", "Powers", "Pratt", "Preston", "Price", "Prince", "Pruitt", "Puckett", "Pugh", "Quinn", "Ramirez", "Ramos", "Ramsey", "Randall", "Randolph", "Rasmussen", "Ratliff", "Ray", "Raymond", "Reed", "Reese", "Reeves", "Reid", "Reilly", "Reyes", "Reynolds", "Rhodes", "Rice", "Rich", "Richard", "Richards", "Richardson", "Richmond", "Riddle", "Riggs", "Riley", "Rios", "Rivas", "Rivera", "Rivers", "Roach", "Robbins", "Roberson", "Roberts", "Robertson", "Robinson", "Robles", "Rocha", "Rodgers", "Rodriguez", "Rodriquez", "Rogers", "Rojas", "Rollins", "Roman", "Romero", "Rosales", "Rosario", "Rose", "Ross", "Roth", "Rowe", "Rowland", "Roy", "Ruiz", "Rush", "Russell", "Russo", "Rutledge", "Ryan", "Salas", "Salazar", "Salinas", "Sampson", "Sanchez", "Sanders", "Sandoval", "Sanford", "Santana", "Santiago", "Santos", "Sargent", "Saunders", "Savage", "Sawyer", "Schmidt", "Schneider", "Schroeder", "Schultz", "Schwartz", "Scott", "Sears", "Sellers", "Serrano", "Sexton", "Shaffer", "Shannon", "Sharp", "Sharpe", "Shaw", "Shelton", "Shepard", "Shepherd", "Sheppard", "Sherman", "Shields", "Short", "Silva", "Simmons", "Simon", "Simpson", "Sims", "Singleton", "Skinner", "Slater", "Sloan", "Small", "Smith", "Snider", "Snow", "Snyder", "Solis", "Solomon", "Sosa", "Soto", "Sparks", "Spears", "Spence", "Spencer", "Stafford", "Stanley", "Stanton", "Stark", "Steele", "Stein", "Stephens", "Stephenson", "Stevens", "Stevenson", "Stewart", "Stokes", "Stone", "Stout", "Strickland", "Strong", "Stuart", "Suarez", "Sullivan", "Summers", "Sutton", "Swanson", "Sweeney", "Sweet", "Sykes", "Talley", "Tanner", "Tate", "Taylor", "Terrell", "Terry", "Thomas", "Thompson", "Thornton", "Tillman", "Todd", "Tolbert", "Torres", "Townsend", "Tran", "Travis", "Trevino", "Trujillo", "Tucker", "Turner", "Tyler", "Tyson", "Underwood", "Valdez", "Valencia", "Valentine", "Valenzuela", "Vance", "Vang", "Vargas", "Vasquez", "Vaughan", "Vaughn", "Vazquez", "Vega", "Velasquez", "Velazquez", "Velez", "Villarreal", "Vincent", "Vinson", "Wade", "Wagner", "Walker", "Wall", "Wallace", "Waller", "Walls", "Walsh", "Walter", "Walters", "Walton", "Ward", "Ware", "Warner", "Warren", "Washington", "Waters", "Watkins", "Watson", "Watts", "Weaver", "Webb", "Weber", "Webster", "Weeks", "Weiss", "Welch", "Wells", "West", "Wheeler", "Whitaker", "White", "Whitehead", "Whitfield", "Whitley", "Whitney", "Wiggins", "Wilcox", "Wilder", "Wiley", "Wilkerson", "Wilkins", "Wilkinson", "William", "Williams", "Williamson", "Willis", "Wilson", "Winters", "Wise", "Witt", "Wolf", "Wolfe", "Wong", "Wood", "Woodard", "woods", "Woodward", "Wooten", "Workman", "Wright", "Wyatt", "Wynn", "Yang", "Yates", "York", "Young", "Zamora", "Zimmerman"];
const streetNames = ["Maple", "Oak", "Pine", "Main", "Cedar", "Elm", "Washington", "Lake", "Hill", "Park", "View", "Valley", "Ridge", "Sunset", "Willow", "First", "Second", "Third", "Fourth", "Fifth", "Forest", "Highland", "Meadow", "River", "Spring", "Walnut", "Chestnut", "Church", "Mill", "North", "South", "East", "West"];
const streetTypes = ["St", "Ave", "Rd", "Ln", "Blvd", "Dr", "Ct", "Way", "Pl"];
const cities = ["Springfield", "Shelbyville", "Chicago", "Peoria", "Naperville", "Rockford", "Joliet", "Evanston", "Aurora", "Champaign"];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function generateVoters(count: number): Voter[] {
  const voters: Voter[] = [];
  
  // Add our specific test cases first to ensure they exist
  voters.push(
    {
      _id: "v_fixed_1",
      firstName: "Alexandra",
      lastName: "Hamilton",
      address: { streetNumber: "123", street: "Maple Avenue", city: "Springfield", state: "IL", zipCode: "62704" },
      voterId: "V10001",
      partyAffiliation: "Democrat",
      status: "Active"
    },
    {
      _id: "v_fixed_2",
      firstName: "Robert",
      lastName: "Smith",
      address: { streetNumber: "45", street: "Oak Street", city: "Springfield", state: "IL", zipCode: "62704" },
      voterId: "V10004",
      partyAffiliation: "Democrat",
      status: "Active"
    }
  );

  for (let i = 0; i < count - 2; i++) {
    const fn = randomElement(firstNames);
    const ln = randomElement(lastNames);
    const stNum = randomInt(1, 9999).toString();
    const stName = `${randomElement(streetNames)} ${randomElement(streetTypes)}`;
    const city = randomElement(cities);
    
    voters.push({
      _id: `v_${i}`,
      firstName: fn,
      lastName: ln,
      address: {
        streetNumber: stNum,
        street: stName,
        city: city,
        state: "IL",
        zipCode: randomInt(60000, 62999).toString()
      },
      voterId: `V${randomInt(10000, 99999)}`,
      partyAffiliation: randomElement(["Democrat", "Republican", "Independent", "Green", "Libertarian"]),
      status: randomElement(["Active", "Inactive", "Historical"])
    });
  }
  return voters;
}

function generateBallots(count: number, voters: Voter[]): BallotSheetItem[] {
  const ballots: BallotSheetItem[] = [];
  const guaranteedMatches = 30;
  
  // 1. Generate guaranteed matches
  for (let i = 0; i < guaranteedMatches; i++) {
    // Pick a voter from the list (using modulo to be safe, though we have 200 voters)
    const voter = voters[i % voters.length];
    
    // 10% chance of a slight typo, but still intended to be a match
    const typo = Math.random() > 0.9; 
    
    let namePrinted = `${voter.firstName} ${voter.lastName}`;
    if (typo) {
      // Simple typo: remove last char or add a period
      if (Math.random() > 0.5) namePrinted = namePrinted.slice(0, -1);
      else namePrinted = namePrinted + ".";
    }

    ballots.push({
      _id: `b_match_${i}`,
      nameprinted: namePrinted,
      registeredaddress: {
        streetNumber: voter.address.streetNumber,
        streetName: voter.address.street,
        city: voter.address.city,
        state: voter.address.state,
        zip: voter.address.zipCode
      }
    });
  }

  // 2. Generate the rest as random (non-matches or accidental matches)
  for (let i = guaranteedMatches; i < count; i++) {
    // Random ballot
    ballots.push({
      _id: `b_random_${i}`,
      nameprinted: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
      registeredaddress: {
        streetNumber: randomInt(1, 9999).toString(),
        streetName: `${randomElement(streetNames)} ${randomElement(streetTypes)}`,
        city: randomElement(cities),
        state: "IL",
        zip: randomInt(60000, 62999).toString()
      }
    });
  }
  
  // Shuffle the ballots so the matches aren't just the first 30
  return ballots.sort(() => Math.random() - 0.5);
}

export const mockVoters = generateVoters(200);
export const mockBallotSheets = generateBallots(50, mockVoters);
