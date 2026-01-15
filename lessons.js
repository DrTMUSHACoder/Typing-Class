const lessonData = {
    // --- 1. Home Row Basics ---
    'basics-1': { title: "Card 1: ASDF Basics", text: "asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf", instruction: "Home Row: Left hand on A-S-D-F." },
    'basics-2': { title: "Card 2: SADD Variations", text: "sadd sadd sadd dass dass dass sads sads sads fads fads fads fdas fdas fdas", instruction: "Focus on finger switching." },
    'basics-3': { title: "Card 3: Rhythm Practice", text: "sass sass sass dass dass dass dadd dadd dadd fads fads fads fasd fasd fasd", instruction: "Build rhythm." },
    'basics-4': { title: "Card 4: JKL; Basics", text: "jkl; jkl; jkl; jkl; jkl; jkl; jkl; jkl; jkl; jkl; jkl; jkl; jkl; jkl; jkl; jkl;", instruction: "Right hand: J-K-L-;" },
    'basics-5': { title: "Card 5: Right Hand Mix", text: "jljl jljl jljl jljl klkl klkl klkl jlk jlk jlk jlk jlk jkl; jkl; jkl; jkl;", instruction: "Right hand alterations." },
    'basics-6': { title: "Card 6: Two Hand Mix", text: "jkd skdk djfj ;ldkf dkf fjdfj dksl dkfj dls; kls adkf jkds jasd jasd jasd", instruction: "Mixing both hands." },
    'basics-7': { title: "Card 7: Word Formation 1", text: "sas dad dds jad djd als dsld als sld skdf sdkf ajask ajask jask jask jask", instruction: "Semi-words." },
    'basics-8': { title: "Card 8: Word Formation 2", text: "das dad das dad sad sas sad sas lass lass lass jads jads jads laja laja laja", instruction: "Keep eyes on screen." },
    'basics-9': { title: "Card 9: Complexity", text: "kads kasd alkd jlald kdka; dkal l;l;l; l;l;l; l;l;l; as; as; as; as; jass jass", instruction: "Complex patterns." },
    'basics-10': { title: "Card 10: Repetitions", text: "das das das das fas fas fas fas jas jas jas jas kas kas kas kas las las las las", instruction: "Repetition builds speed." },
    'basics-11': { title: "Card 11: Flow", text: "lass lass lass dass dass dass jass jass jass kass kass kass fass fass fass", instruction: "Flow between keys." },
    'basics-12': { title: "Card 12: Mastery Check", text: "jkl; asdf jkl; asdf jask jask jask ;lkj ;lkj ;lkj ;lkj fdsa fdsa fdsa jfkd jfkd", instruction: "Full home row check." },

    // --- 2. Index Reaches ---
    'letter-g': { title: "Letter G (Cards 13-15)", text: "fgfg fgfg fgfg fgfg dgdg dgdg dgdg sgsg sgsg sgsg agag agag agag lglg lglg gag gag gag gag gaga gaga gaga jagg jagg jagg gad gas gaf gag kaga kaga kaga", instruction: "Left Index -> G" },
    'letter-h': { title: "Letter H (Cards 14-17)", text: "jhjh jhjh jhjh jhjh khkh khkh khkh lhlh lhlh lhlh fbfb fbfb fbfb dhdh dhdh jkh jkh jkh jkh dah dah dah dah sah sah sah sah sha sha sha sha sha lah lah lah lah", instruction: "Right Index -> H" },
    'letter-gh': { title: "G & H Integrated (18-20)", text: "ghgh ghgh ghgh jhfg jhfg jhfg jhfg kjhg kjhg kjhg dfgh dfgh dfgh sagh sagh sagh sagh sagh sagh jagh jagh jagh kagh kagh kagh lagh lagh lagh asgh asgh asgh", instruction: "Both Index Reaches" },

    // --- 3. Top Row Reaches ---
    'letter-r': { title: "Letter R (Cards 21-23)", text: "frfr frfr frfr frfr fraf fraf fraf fraf frad frad frad frad jar jar jar jar sard sard sard rfrf rfrf rfrf rfrf frfr frfr frfr frfr darf darf darf sark sark sark lark lark lark rad rad rad rad rak rak rak rak raja raja raja raja krass krass krass lark lark lark lark", instruction: "Left Index -> R" },
    'letter-u': { title: "Letter U (Cards 24-26)", text: "juju juju juju juju ujuj ujuj ujuj ujuj uujj uujj uujj uujj juk juk juk juk sud sud sud sud dud dud dud dud hug hug hug hug lug lug lug lug juju frfr juju frfr jufr jufr jufr jufr fruj fruj fruj fruj daug daug daug lauk lauk lauk", instruction: "Right Index -> U" },
    'letter-i': { title: "Letter I (Cards 27-29)", text: "jik jik jik jik jill jill jill jill kill kill kill kill sill sill sill sill dill dill dill dill disk disk disk disk kiss kiss kiss kiss said said said laid laid laid sikh sikh sikh aid aid aid aid sid sid sid sid lids lids lids lids kids kids kids hid hid hid hid", instruction: "Right Middle -> I" },
    'letter-e': { title: "Letter E (Cards 30-32)", text: "dee dee dee dee deed deed deed see see see see seed seed seed fee fee fee fee seek seek seek seek seal seal seal seal keel keel keel keel led led led led lead lead lead heel heel heel heel deal deal deal deal leak leak leak leak lead lead lead lead greek greek greek", instruction: "Left Middle -> E" },

    // New Top Row  from Images
    'letter-w': { title: "Letter W (Cards 52-54)", text: "swsw swsw swsw swim swim swim swine swine swine swing swing sway sway wheel wheel wind wind wind wash wash wash well well well when when when whammy where where where why why why why when when when will will will will", instruction: "Left Ring -> W. Keep other fingers on Home Row." },
    'letter-o': { title: "Letter O (Cards 55-57)", text: "lolo lolo lolo lolo olol olol olol olol wow wow wow low low low low sow sow sow sow orange orange to too to too tools tools tools cool cool cool cow cow cow old old old old old cold cold cold cold told told told told today today today took took took", instruction: "Right Ring -> O. Keep others anchored." },
    'letter-q': { title: "Letter Q (Cards 61-62)", text: "aqaq aqaq aqaq quiet quiet quiet quit quit quit quit quite quite quite question question aqua aqua aqua quadrangle quake quake quake queen queen quick quick", instruction: "Left Pinky -> Q. Reach up!" },
    'letter-p': { title: "Letter P (Cards 63-64)", text: ";p;p ;p;p ;p;p ;p;p pop pop pop pop peep peep peep happy happy deep deep deep peter piper picked a peck of pickled peppers peter piper picked peppers", instruction: "Right Pinky -> P. Reach up!" },

    // --- 4. Bottom Row Reaches (New) ---
    'letter-c': { title: "Letter C (Cards 41-43)", text: "cackle cackle cactus cactus caddy caddy cage cage cage cake cake cake call call call call care care care care car car car car career career cast cast cast the cat ate cake the cat ate cake the cat ate cake the cat ate cake the cat ate cake", instruction: "Left Middle -> C. Reach down." },
    'letter-m': { title: "Letter M (Cards 44-46)", text: "jmjmj jmjm jmjm dcdc jmjm dcdc mat mat mat mat mum mum mum mill mill mill mill made made made make make make male male male female female magic magic mystery mystery mars mars mars market market mime mime mighty mighty", instruction: "Right Index -> M. Reach down." },
    'letter-v': { title: "Letter V (Cards 47-48)", text: "fvfv fvfv fvfv vat vat vat vat vacate vacate vacuum vacuum valid valid vet vet vet vet value value value have have have save save save live live live", instruction: "Left Index -> V. Reach down." },
    'letter-n': { title: "Letter N (Cards 49-51)", text: "jnjn jnjn jnjn njnj njnj njnj nickle nickle numeral numeral nellie nellie can can can can cannot cannot cannot land land land sand sand sand grand grand grand nine nine nine nine ninety ninety nineteenth nine hundred ninety nine", instruction: "Right Index -> N. Reach down." },
    'letter-b': { title: "Letter B (Cards 58-60)", text: "fbfb fbfb fbfb fbfb bnbn bnbn bnbn bob bob bob bob back back back bill bill bill bill babble babble baby baby baby be be be be be bee bee bee bee ball ball ball ball billy bunter biffed bobby billy bunter biffed bobby billy and bobby", instruction: "Left Index -> B (Longer reach)." },

    // --- 5. Alphabet Practice ---
    'alpha-az-lower': { title: "Card 65: a to z (lowercase)", text: "a b c d e f g h i j k l m n o p q r s t u v w x y z", instruction: "Type the alphabet." },
    'alpha-za-lower': { title: "Card 66: z to a (lowercase)", text: "z y x w v u t s r q p o n m l k j i h g f e d c b a", instruction: "Reverse alphabet." },
    'alpha-az-upper': { title: "Card 67: A to Z (UPPERCASE)", text: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z", instruction: "Use Shift keys!" },
    'alpha-za-upper': { title: "Card 68: Z to A (UPPERCASE)", text: "Z Y X W V U T S R Q P O N M L K J I H G F E D C B A", instruction: "Reverse Uppercase." }
};

const lessonGroups = {
    'Home Row': ['basics-1', 'basics-2', 'basics-3', 'basics-4', 'basics-5', 'basics-6', 'basics-7', 'basics-8', 'basics-9', 'basics-10', 'basics-11', 'basics-12'],
    'Index Reaches': ['letter-g', 'letter-h', 'letter-gh'],
    'Top Row': ['letter-q', 'letter-w', 'letter-e', 'letter-r', 'letter-t', 'letter-y', 'letter-u', 'letter-i', 'letter-o', 'letter-p'], // Reordered for QWERTY natural order logic or keep difficulty? QWERTY is better for finding.
    'Bottom Row': ['letter-z', 'letter-x', 'letter-c', 'letter-v', 'letter-b', 'letter-n', 'letter-m', 'letter-comma', 'letter-dot', 'letter-slash'],
    'Alphabet': ['alpha-az-lower', 'alpha-za-lower', 'alpha-az-upper', 'alpha-za-upper']
};

// Update arrays to match available data
// Note: I don't have explicit Z, X cards in the new set, and T, Y were not in previous set either. 
// I will filter the list to only what I have defined to avoid crashes.
lessonGroups['Top Row'] = ['letter-q', 'letter-w', 'letter-e', 'letter-r', 'letter-u', 'letter-i', 'letter-o', 'letter-p']; // T, Y missing keys
lessonGroups['Bottom Row'] = ['letter-c', 'letter-v', 'letter-b', 'letter-n', 'letter-m']; // Z, X, comma, dot missing keys

window.lessonData = lessonData;
window.lessonGroups = lessonGroups;
