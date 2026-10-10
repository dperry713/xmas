/**
 * 24 Advent Days Data Master
 * Typed with AdventDay interface
 */

import type { AdventDay } from '../types/advent';

export const ADVENT_DAYS: AdventDay[] = [
  {
    day: 1,
    dateLabel: "December 1",
    theme: "The Light in the Courtyard",
    location: "The North Archway Gas Lantern",
    coordinates: { x: 5.2, y: 44.5 },
    pos3d: { x: -28, y: 7.2, z: 10 },
    camTarget3d: { x: -24, y: 8, z: 22, lookAt: { x: -28, y: 7.2, z: 10 } },
    scripture: "“The people walking in darkness have seen a great light.” — Isaiah 9:2",
    reflection: "As the winter dusk settles across the ancient stone archways, a single lamp is lit. Advent begins not with a blinding blaze, but with a quiet, patient spark. In a world often hurried and noisy, we are invited to pause and welcome the earliest glimmer of hope.",
    activity: "Light a candle in your window or at your table tonight. Send a short note of encouragement to someone who may be carrying a quiet burden.",
    goDeeperUrl: "https://www.churchofengland.org/prayer-and-worship/join-us-service-daily-prayer",
    goDeeperLabel: "Explore the Advent Wreath Tradition",
    vignette: { type: "lantern", title: "The Solitary Lantern", accentColor: "#F59E0B" },
    piazzaAwakening: "North street gas lantern ignites, casting dynamic 3D golden light pools across the cobblestones."
  },
  {
    day: 2,
    dateLabel: "December 2",
    theme: "Warmth from the Hearth",
    location: "The Old Town Bakery",
    coordinates: { x: 12.5, y: 68.0 },
    pos3d: { x: -36, y: 3.8, z: -15 },
    camTarget3d: { x: -26, y: 6, z: 0, lookAt: { x: -36, y: 3.8, z: -15 } },
    scripture: "“Give us this day our daily bread.” — Matthew 6:11",
    reflection: "From the gabled bakery by the corner comes the aroma of freshly kneaded dough, spiced cinnamon, and roasted almonds. Sharing bread has always been humanity’s most sacred sign of fellowship and trust. Warmth is meant to be shared.",
    activity: "Bake or buy a loaf of bread or sweet rolls and gift it to a neighbor, postal worker, or caregiver in your neighborhood.",
    goDeeperUrl: "https://www.churchofengland.org/our-faith/living-out-our-faith",
    goDeeperLabel: "Reflect on Community & Generosity",
    vignette: { type: "bakery", title: "The Baker's Hearth", accentColor: "#D97706" },
    piazzaAwakening: "Bakery storefront illuminates with amber firelight and warm 3D chimney steam."
  },
  {
    day: 3,
    dateLabel: "December 3",
    theme: "The Whispering Snow",
    location: "The Cobblestone Alleys",
    coordinates: { x: 16.5, y: 30.5 },
    pos3d: { x: -30, y: 14.0, z: -28 },
    camTarget3d: { x: -20, y: 16, z: -10, lookAt: { x: -30, y: 14.0, z: -28 } },
    scripture: "“Be still, and know that I am God.” — Psalm 46:10",
    reflection: "A hush falls over the rooftops as the first gentle snowflakes drift down between the timbered facades. Snow softens the rough edges of the world. In the stillness of winter, we find space to listen to what our hearts truly need.",
    activity: "Take a quiet ten-minute walk outside in silence, noticing five things you are deeply thankful for this season.",
    goDeeperUrl: "https://www.churchofengland.org/prayer-and-worship",
    goDeeperLabel: "Read the Daily Meditation on Stillness",
    vignette: { type: "snowfall", title: "Quiet Rooftops", accentColor: "#93C5FD" },
    piazzaAwakening: "Volumetric 3D snowfall settles over the gabled rooftops and cobblestone alleys."
  },
  {
    day: 4,
    dateLabel: "December 4",
    theme: "Living Water in Winter",
    location: "The Piazza Stone Fountain",
    coordinates: { x: 64.0, y: 64.0 },
    pos3d: { x: 16, y: 3.2, z: 6 },
    camTarget3d: { x: 8, y: 6, z: 18, lookAt: { x: 16, y: 3.2, z: 6 } },
    scripture: "“Whoever drinks of the water that I will give will never thirst again.” — John 4:14",
    reflection: "Even in freezing weather, the centuries-old stone fountain murmurs in the piazza center, crowned with crystalline icicles. It reminds us of an enduring spring of life that cold cannot freeze and sorrow cannot extinguish.",
    activity: "Support a local shelter or charity offering clean water, warmth, or hot meals to those without shelter.",
    goDeeperUrl: "https://www.churchofengland.org/our-faith/charity-and-service",
    goDeeperLabel: "Discover Winter Care Outreach",
    vignette: { type: "fountain", title: "The Frosted Basin", accentColor: "#60A5FA" },
    piazzaAwakening: "Stone fountain illuminates with crystalline ice glows and reflective water ripples."
  },
  {
    day: 5,
    dateLabel: "December 5",
    theme: "The Spice of Hospitality",
    location: "The Spiced Cider Stall",
    coordinates: { x: 22.0, y: 65.0 },
    pos3d: { x: -20, y: 2.8, z: -4 },
    camTarget3d: { x: -12, y: 5, z: 8, lookAt: { x: -20, y: 2.8, z: -4 } },
    scripture: "“Do not forget to show hospitality to strangers, for by so doing some have entertained angels.” — Hebrews 13:2",
    reflection: "Vat cauldrons of spiced apple cider, cloves, and star anise bubble over gentle embers at the wooden market stall. In cold seasons, welcoming a stranger with a hot drink transforms distance into warmth.",
    activity: "Invite a friend or someone living alone over for warm spiced tea, hot cocoa, or a shared conversation.",
    goDeeperUrl: "https://www.churchofengland.org/hospitality-advent",
    goDeeperLabel: "A Practice of Radical Hospitality",
    vignette: { type: "steaming-cup", title: "Spiced Wassail Stall", accentColor: "#EF4444" },
    piazzaAwakening: "Wooden spiced cider stall opens with red striped canopy and glowing copper cauldrons."
  },
  {
    day: 6,
    dateLabel: "December 6",
    theme: "The Spirit of St. Nicholas",
    location: "The Toymaker’s Wooden Cart",
    coordinates: { x: 30.5, y: 63.5 },
    pos3d: { x: -14, y: 2.6, z: 10 },
    camTarget3d: { x: -6, y: 5, z: 22, lookAt: { x: -14, y: 2.6, z: 10 } },
    scripture: "“It is more blessed to give than to receive.” — Acts 20:35",
    reflection: "On St. Nicholas Day, stories of secret benevolence echo through European streets—coins left in boots, small wooden toys carved in secret. Real generosity seeks no applause, only to lift another's burden.",
    activity: "Leave a secret gift, book, or kind treat for a child, coworker, or friend without attaching your name.",
    goDeeperUrl: "https://www.churchofengland.org/st-nicholas-story",
    goDeeperLabel: "The Historical Life of Nicholas of Myra",
    vignette: { type: "wooden-toy", title: "Carved Nutcracker", accentColor: "#F59E0B" },
    piazzaAwakening: "Handcrafted toy cart with wooden nutcrackers appears in the square."
  },
  {
    day: 7,
    dateLabel: "December 7",
    theme: "The Caroler’s Melody",
    location: "The Cathedral Steps",
    coordinates: { x: 44.0, y: 67.0 },
    pos3d: { x: -8, y: 3.5, z: -32 },
    camTarget3d: { x: 0, y: 6, z: -18, lookAt: { x: -8, y: 3.5, z: -32 } },
    scripture: "“Make a joyful noise unto the Lord, all the earth.” — Psalm 100:1",
    reflection: "A violin sings out over the chatter of the market. Carolers in heavy woolen scarves gather near the stone steps, their voices harmonizing ancient tunes that have carried through centuries of winter nights.",
    activity: "Listen to a classic choral piece or hymn today (such as O Come, O Come Emmanuel) and sing along with joyful heart.",
    goDeeperUrl: "https://www.churchofengland.org/choir-and-music",
    goDeeperLabel: "Listen to the Cathedral Choir Carols",
    vignette: { type: "music", title: "Violin & Sheet Music", accentColor: "#FBBF24" },
    piazzaAwakening: "Caroler music pavilion lights up with glowing candle lanterns."
  },
  {
    day: 8,
    dateLabel: "December 8",
    theme: "The Rose of Stained Glass",
    location: "The Cathedral Rose Window",
    coordinates: { x: 58.5, y: 35.0 },
    pos3d: { x: 0, y: 22.0, z: -55 },
    camTarget3d: { x: 0, y: 22, z: -32, lookAt: { x: 0, y: 22.0, z: -55 } },
    scripture: "“For God, who said, ‘Let light shine out of darkness,’ made His light shine in our hearts.” — 2 Corinthians 4:6",
    reflection: "High above the piazza, the magnificent gothic rose window begins to glow from within. Jewels of cobalt, ruby, and amber pierce the winter evening, reminding us that broken pieces can be formed into enduring beauty.",
    activity: "Look for beauty in something that feels fractured in your own life or relationships today, asking for grace to mend it.",
    goDeeperUrl: "https://www.churchofengland.org/cathedral-windows",
    goDeeperLabel: "The Sacred Geometry of Cathedral Glass",
    vignette: { type: "rose-window", title: "The Illuminated Rose", accentColor: "#818CF8" },
    piazzaAwakening: "Cathedral Rose Window blazes with radiant stained-glass emissive light beams."
  },
  {
    day: 9,
    dateLabel: "December 9",
    theme: "Embers of Good Cheer",
    location: "The Roasted Chestnut Roaster",
    coordinates: { x: 40.0, y: 73.0 },
    pos3d: { x: -8, y: 2.2, z: 20 },
    camTarget3d: { x: 0, y: 4, z: 30, lookAt: { x: -8, y: 2.2, z: 20 } },
    scripture: "“A cheerful heart is good medicine.” — Proverbs 17:22",
    reflection: "Crackling coals glow beneath iron pans roasting sweet winter chestnuts. The simple crackle of fire and the shared cone of paper nuts bring smiles to strangers waiting side by side in the brisk breeze.",
    activity: "Bring a warm, cheerful spirit to every interaction you have today—greet a cashier, thank a bus driver, smile warmly.",
    goDeeperUrl: "https://www.churchofengland.org/advent-joy",
    goDeeperLabel: "Cultivating Everyday Joy in Advent",
    vignette: { type: "chestnut-fire", title: "The Roasting Pan", accentColor: "#F97316" },
    piazzaAwakening: "Roasted chestnut cart with glowing fire embers sets up in the square."
  },
  {
    day: 10,
    dateLabel: "December 10",
    theme: "The Tower Chimes",
    location: "The Historic Clock Tower",
    coordinates: { x: 72.0, y: 20.0 },
    pos3d: { x: 28, y: 28.0, z: -46 },
    camTarget3d: { x: 22, y: 26, z: -25, lookAt: { x: 28, y: 28.0, z: -46 } },
    scripture: "“There is a time for everything, and a season for every activity under the heavens.” — Ecclesiastes 3:1",
    reflection: "The great brass bells in the clock tower ring out over the rooftops, marking each hour. Time in Advent is not a countdown of stress, but a cadence of holy expectation, beckoning us to make room in our busy calendars.",
    activity: "Deliberately decline one non-essential obligation this week to protect quiet time with family or silent prayer.",
    goDeeperUrl: "https://www.churchofengland.org/prayer/time",
    goDeeperLabel: "A Liturgy for Reclaiming Time",
    vignette: { type: "bell-tower", title: "The Campanile Bell", accentColor: "#EAB308" },
    piazzaAwakening: "Clock tower golden dial illuminates and bells resonate over the rooftops."
  },
  {
    day: 11,
    dateLabel: "December 11",
    theme: "The Evergreen of Life",
    location: "The Grand Piazza Pine",
    coordinates: { x: 50.0, y: 45.0 },
    pos3d: { x: 0, y: 10.0, z: -12 },
    camTarget3d: { x: 0, y: 12, z: 8, lookAt: { x: 0, y: 10.0, z: -12 } },
    scripture: "“I am like an evergreen cypress; your faithfulness comes from me.” — Hosea 14:8",
    reflection: "Brought down from the alpine forests, the great fir tree stands tall in the center of the piazza. Its needles stay green through frost and gale, a testament that life perseveres even through the deepest winter.",
    activity: "Bring a sprig of pine, cedar, or rosemary into your home. Let its fresh fragrance remind you of persistent hope.",
    goDeeperUrl: "https://www.churchofengland.org/creation-care",
    goDeeperLabel: "Caring for Creation in Winter",
    vignette: { type: "evergreen", title: "The Alpine Fir", accentColor: "#10B981" },
    piazzaAwakening: "The Grand 3D Evergreen Christmas Tree is officially erected in the center of the square!"
  },
  {
    day: 12,
    dateLabel: "December 12",
    theme: "Sweetness of Tradition",
    location: "The Lebkuchen & Gingerbread Stall",
    coordinates: { x: 92.0, y: 69.0 },
    pos3d: { x: 32, y: 2.8, z: -8 },
    camTarget3d: { x: 22, y: 5, z: 4, lookAt: { x: 32, y: 2.8, z: -8 } },
    scripture: "“How sweet are your words to my taste, sweeter than honey to my mouth!” — Psalm 119:103",
    reflection: "Heart-shaped gingerbread hanging on festive ribbons carries handwritten words of affection: Liebe, Friede, Freude. Traditions connect generations, passing tenderness across the boundaries of time.",
    activity: "Call or write to an elder family member or mentor and ask them about their favorite childhood holiday memory.",
    goDeeperUrl: "https://www.churchofengland.org/family-traditions",
    goDeeperLabel: "Passing Faith & Heritage Across Generations",
    vignette: { type: "gingerbread", title: "Frosted Gingerbread Heart", accentColor: "#B45309" },
    piazzaAwakening: "Lebkuchen gingerbread stall opens with rows of frosted heart cookies and festive lights."
  },
  {
    day: 13,
    dateLabel: "December 13",
    theme: "Crown of Candles (St. Lucia)",
    location: "The Colonnade Procession",
    coordinates: { x: 79.5, y: 55.0 },
    pos3d: { x: 26, y: 4.5, z: 12 },
    camTarget3d: { x: 18, y: 6, z: 24, lookAt: { x: 26, y: 4.5, z: 12 } },
    scripture: "“The light shines in the darkness, and the darkness has not overcome it.” — John 1:5",
    reflection: "Today, northern traditions celebrate Lucia carrying light into the longest winter night with a wreath of candles on her head. Where shadows seem deep, the smallest flame holds absolute authority.",
    activity: "Light candles during your evening meal, and say a prayer for places in our world experiencing conflict or darkness.",
    goDeeperUrl: "https://www.churchofengland.org/lucia-tradition",
    goDeeperLabel: "The Feast of Saint Lucia",
    vignette: { type: "lucia-crown", title: "Candlelit Wreath", accentColor: "#FDE047" },
    piazzaAwakening: "Warm candlelight procession lanterns illuminate along the eastern colonnade."
  },
  {
    day: 14,
    dateLabel: "December 14",
    theme: "Garlands Across the Stones",
    location: "The Alleyway Archways",
    coordinates: { x: 35.0, y: 50.0 },
    pos3d: { x: -18, y: 11.0, z: -18 },
    camTarget3d: { x: -8, y: 12, z: -2, lookAt: { x: -18, y: 11.0, z: -18 } },
    scripture: "“Above all these put on love, which binds everything together in perfect harmony.” — Colossians 3:14",
    reflection: "Evergreen garlands woven with red ribbons now span the narrow alleyways between the stone houses. Like these garlands, love binds a community together across every alley, bridge, and threshold.",
    activity: "Reconcile with someone you have grown distant from. Extend an olive branch of forgiveness or warmth.",
    goDeeperUrl: "https://www.churchofengland.org/peace-reconciliation",
    goDeeperLabel: "Reflections on Peace & Reconciliation",
    vignette: { type: "garland", title: "Evergreen Swag", accentColor: "#059669" },
    piazzaAwakening: "Lush 3D evergreen garlands and red bows drape across medieval facades."
  },
  {
    day: 15,
    dateLabel: "December 15",
    theme: "Gliding on the Winter Ice",
    location: "The Piazza Ice Rink Perimeter",
    coordinates: { x: 70.0, y: 80.0 },
    pos3d: { x: 18, y: 1.2, z: 22 },
    camTarget3d: { x: 10, y: 4, z: 32, lookAt: { x: 18, y: 1.2, z: 22 } },
    scripture: "“You have turned my mourning into joyful dancing!” — Psalm 30:11",
    reflection: "Laughter rings out as children and couples glide across the glazed cobblestones. Even in the brisk cold, joy is playful and resilient. Life was made to be celebrated, not merely endured.",
    activity: "Engage in an hour of playful recreation today—ice skate, build a snowman, play a board game with loved ones.",
    goDeeperUrl: "https://www.churchofengland.org/joy-and-play",
    goDeeperLabel: "Reclaiming Wonder and Childlike Joy",
    vignette: { type: "ice-skate", title: "Gliding Blades", accentColor: "#38BDF8" },
    piazzaAwakening: "Glazed ice pathway glistens with festive frost reflections."
  },
  {
    day: 16,
    dateLabel: "December 16",
    theme: "The Cathedral Organ",
    location: "The Cathedral High Portal",
    coordinates: { x: 59.0, y: 53.0 },
    pos3d: { x: 0, y: 5.5, z: -50 },
    camTarget3d: { x: 0, y: 7, z: -35, lookAt: { x: 0, y: 5.5, z: -50 } },
    scripture: "“Praise Him with sounding cymbals and strings; let everything that has breath praise the Lord!” — Psalm 150:6",
    reflection: "Through the cathedral’s towering wooden doors spills the deep resonance of pipe organ pedal tones. The chords reverberate in your chest, grounding the spirit in grandeur and reverence.",
    activity: "Pause for three minutes of deep breathing while listening to an organ or acoustic hymn.",
    goDeeperUrl: "https://www.churchofengland.org/cathedral-music",
    goDeeperLabel: "Listen to the Great Organ of the Cathedral",
    vignette: { type: "organ-pipe", title: "The Golden Pipes", accentColor: "#F59E0B" },
    piazzaAwakening: "Cathedral grand portal doors open, radiating warm amber choir light."
  },
  {
    day: 17,
    dateLabel: "December 17",
    theme: "Comfort in the Chill",
    location: "The Eastern Street Lamp",
    coordinates: { x: 83.0, y: 44.0 },
    pos3d: { x: 28, y: 7.2, z: 10 },
    camTarget3d: { x: 22, y: 8, z: 22, lookAt: { x: 28, y: 7.2, z: 10 } },
    scripture: "“Praise be to the God of all comfort, who comforts us in all our troubles.” — 2 Corinthians 1:3-4",
    reflection: "A winter coat, a warm woolen scarf, a hand gently held—comfort comes in tangible, quiet ways. We are called to be the coat and the warm hands for those who feel the cold wind of grief or loneliness.",
    activity: "Donate warm winter coats, thick socks, or blankets to a local shelter or refugee support program.",
    goDeeperUrl: "https://www.churchofengland.org/winter-charity",
    goDeeperLabel: "Winter Care & Warmth Ministry",
    vignette: { type: "lantern-twin", title: "Eastern Gas Lamp", accentColor: "#F59E0B" },
    piazzaAwakening: "Eastern wrought-iron street lamp ignites, casting dual golden light cones."
  },
  {
    day: 18,
    dateLabel: "December 18",
    theme: "The Golden Brass Horns",
    location: "The Market Square Pavilion",
    coordinates: { x: 48.0, y: 58.0 },
    pos3d: { x: 10, y: 3.2, z: -18 },
    camTarget3d: { x: 2, y: 5, z: -6, lookAt: { x: 10, y: 3.2, z: -18 } },
    scripture: "“With trumpets and the sound of the horn make a joyful noise before the King!” — Psalm 98:6",
    reflection: "Four brass horn players stand by the market fountain, their golden trumpets reflecting the tree lights. The rich sound cuts cleanly through the crisp winter evening, stirring feelings of anticipation.",
    activity: "Share a piece of festive music with someone who is having a difficult week.",
    goDeeperUrl: "https://www.churchofengland.org/brass-carols",
    goDeeperLabel: "Advent Brass Hymns & Anthems",
    vignette: { type: "brass-horn", title: "The French Horn", accentColor: "#EAB308" },
    piazzaAwakening: "Brass horn pavilion displays illuminated golden banners and wreaths."
  },
  {
    day: 19,
    dateLabel: "December 19",
    theme: "A Thousand Twinkling Stars",
    location: "The Illuminated Pine Branches",
    coordinates: { x: 50.0, y: 38.0 },
    pos3d: { x: 0, y: 13.0, z: -12 },
    camTarget3d: { x: 0, y: 14, z: 6, lookAt: { x: 0, y: 13.0, z: -12 } },
    scripture: "“He counts the number of the stars; He calls them all by their names.” — Psalm 147:4",
    reflection: "The switch is thrown: hundreds of golden fairy lights illuminate the great fir tree from crown to base. The crowd gasps in delighted wonder. Light multiplying light—this is how goodness spreads across the earth.",
    activity: "Praise and encourage three different people in your circle today for the light and goodness they bring.",
    goDeeperUrl: "https://www.churchofengland.org/tree-blessing",
    goDeeperLabel: "The Blessing of the Christmas Tree",
    vignette: { type: "tree-lights", title: "Twinkling Strands", accentColor: "#FBBF24" },
    piazzaAwakening: "Thousands of twinkling 3D fairy lights ignite across the entire Grand Christmas Tree!"
  },
  {
    day: 20,
    dateLabel: "December 20",
    theme: "The Lowly Manger",
    location: "The Olive Wood Nativity Stall",
    coordinates: { x: 80.0, y: 65.0 },
    pos3d: { x: 22, y: 2.8, z: -22 },
    camTarget3d: { x: 14, y: 5, z: -10, lookAt: { x: 22, y: 2.8, z: -22 } },
    scripture: "“And she gave birth to her firstborn son and wrapped him in swaddling cloths and laid him in a manger.” — Luke 2:7",
    reflection: "Tucked into a quiet corner of the square is a small wooden creche with olive wood figures. God did not arrive in palaces or grand ballrooms, but in simplicity and vulnerability. In humbleness we find true dignity.",
    activity: "Set up a nativity scene or place a humble symbol in your home, reflecting on the simplicity of the Nativity.",
    goDeeperUrl: "https://www.churchofengland.org/nativity-story",
    goDeeperLabel: "The Manger in the Heart: A Meditation",
    vignette: { type: "creche", title: "The Olive Wood Creche", accentColor: "#D97706" },
    piazzaAwakening: "Hand-carved Nativity Creche stall opens with warm candlelight and hay glow."
  },
  {
    day: 21,
    dateLabel: "December 21",
    theme: "The Longest Night (Solstice)",
    location: "The Upper Cathedral Gable",
    coordinates: { x: 58.0, y: 22.0 },
    pos3d: { x: 0, y: 36.0, z: -55 },
    camTarget3d: { x: 0, y: 32, z: -25, lookAt: { x: 0, y: 36.0, z: -55 } },
    scripture: "“The dawn from on high will visit us, to shine upon those who sit in darkness.” — Luke 1:78-79",
    reflection: "Tonight marks the winter solstice, the longest night of the entire year. Yet from this exact threshold, every passing day will bring more light. When things feel darkest, the dawn is already turning toward us.",
    activity: "Reach out to someone grieving a loss or feeling lonely during this holiday season with a phone call or card.",
    goDeeperUrl: "https://www.churchofengland.org/blue-christmas",
    goDeeperLabel: "Blue Christmas: Hope for the Grieving",
    vignette: { type: "solstice", title: "The Winter Solstice Moon", accentColor: "#93C5FD" },
    piazzaAwakening: "Deep sapphire starfield and solstice moon bathe the square in celestial light."
  },
  {
    day: 22,
    dateLabel: "December 22",
    theme: "The Feast of Fellowship",
    location: "The Piazza Long Tables",
    coordinates: { x: 52.0, y: 72.0 },
    pos3d: { x: 6, y: 2.0, z: 12 },
    camTarget3d: { x: -2, y: 5, z: 24, lookAt: { x: 6, y: 2.0, z: 12 } },
    scripture: "“They broke bread in their homes and ate together with glad and sincere hearts.” — Acts 2:46",
    reflection: "Long communal tables are laid out with evergreen boughs, candles, and warm platters. Strangers sit side by side, passing cider and laughing. We were not made for isolation; we are made to sit at table together.",
    activity: "Share a meal with someone outside your immediate family or drop off warm treats for a local firehouse or hospital staff.",
    goDeeperUrl: "https://www.churchofengland.org/community-table",
    goDeeperLabel: "The Sacred Table: Fellowship & Food",
    vignette: { type: "communal-feast", title: "The Shared Table", accentColor: "#F59E0B" },
    piazzaAwakening: "Communal banquet tables appear with candles, pine boughs, and festive platters."
  },
  {
    day: 23,
    dateLabel: "December 23",
    theme: "The Canopy of Light",
    location: "The Overhead Festoon Strings",
    coordinates: { x: 48.0, y: 15.0 },
    pos3d: { x: 0, y: 18.0, z: -5 },
    camTarget3d: { x: 0, y: 14, z: 15, lookAt: { x: 0, y: 18.0, z: -5 } },
    scripture: "“You are the light of the world. A city on a hill cannot be hidden.” — Matthew 5:14",
    reflection: "A canopy of suspended Edison bulbs and warm fairy festoons connects every building in the piazza. Overhead, it feels as if an illuminated ceiling has embraced the town in holy warmth. Tomorrow is the Eve.",
    activity: "Take thirty minutes tonight to sit in the glow of Christmas lights with no screens, phones, or distractions.",
    goDeeperUrl: "https://www.churchofengland.org/canopy-of-grace",
    goDeeperLabel: "Preparing Your Heart for Christmas Eve",
    vignette: { type: "festoon-lights", title: "The Canopy of Bulbs", accentColor: "#FDE68A" },
    piazzaAwakening: "Luminous 3D canopy of overhead light festoons stretches between historic facades."
  },
  {
    day: 24,
    dateLabel: "December 24",
    theme: "Christmas Eve: The Radiant Dawn",
    location: "The Star of Bethlehem atop the Tree",
    coordinates: { x: 50.0, y: 27.5 },
    pos3d: { x: 0, y: 22.5, z: -12 },
    camTarget3d: { x: 0, y: 20, z: 8, lookAt: { x: 0, y: 22.5, z: -12 } },
    scripture: "“Glory to God in the highest, and on earth peace, good will toward men!” — Luke 2:14",
    reflection: "Christmas Eve arrives. The piazza is now completely transformed: every window glows with candlelight, the grand tree radiates warmth, snow falls gently upon the stones, and the midnight bells toll across the city. The waiting is fulfilled. Love has arrived.",
    activity: "Attend a Christmas Eve candlelight service, or light a central candle with your family and read the Luke 2 Nativity story together.",
    goDeeperUrl: "https://www.churchofengland.org/christmas-eve-service",
    goDeeperLabel: "Join the Live Christmas Eve Midnight Service",
    vignette: { type: "radiant-star", title: "The Bethlehem Star", accentColor: "#FEF08A" },
    piazzaAwakening: "The Star of Bethlehem blazes atop the tree! The entire 3D Piazza is in full radiant celebration!"
  }
];

import { DAY_TRANSLATIONS } from './adventDaysI18n';

/**
 * Returns a localized AdventDay object for a given day and language code.
 * Falls back to English if the language or day is not translated.
 */
export function getLocalizedAdventDay(dayNumber: number, lang: string = 'en'): AdventDay {
  const baseDay = ADVENT_DAYS.find(d => d.day === dayNumber) || ADVENT_DAYS[0];
  const langKey = lang.toLowerCase().split('-')[0];
  const langDict = DAY_TRANSLATIONS[langKey];
  const translated = langDict ? langDict[dayNumber] : undefined;

  if (!translated) {
    return baseDay;
  }

  return {
    ...baseDay,
    theme: translated.theme || baseDay.theme,
    location: translated.location || baseDay.location,
    dateLabel: translated.dateLabel || baseDay.dateLabel,
    scripture: translated.scripture || baseDay.scripture,
    reflection: translated.reflection || baseDay.reflection,
    activity: translated.activity || baseDay.activity,
    piazzaAwakening: translated.piazzaAwakening || baseDay.piazzaAwakening,
    goDeeperLabel: translated.goDeeperLabel || baseDay.goDeeperLabel
  };
}

/**
 * Returns all 24 AdventDay objects localized for the specified language.
 */
export function getLocalizedAdventDays(lang: string = 'en'): AdventDay[] {
  return ADVENT_DAYS.map(d => getLocalizedAdventDay(d.day, lang));
}

