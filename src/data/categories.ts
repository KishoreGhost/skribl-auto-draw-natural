/**
 * Complete list of 345 Google Quick, Draw! categories
 * 
 * These are all the words for which stroke data is available from
 * Google Cloud Storage at:
 *   https://storage.googleapis.com/quickdraw_dataset/full/simplified/{word}.ndjson
 * 
 * Source: https://github.com/googlecreativelab/quickdraw-dataset/blob/master/categories.txt
 */

export const QUICKDRAW_CATEGORIES: string[] = [
  'aircraft carrier', 'airplane', 'alarm clock', 'ambulance', 'angel',
  'animal migration', 'ant', 'anvil', 'apple', 'arm', 'asparagus', 'axe',
  'backpack', 'banana', 'bandage', 'barn', 'baseball', 'baseball bat',
  'basket', 'basketball', 'bat', 'bathtub', 'beach', 'bear', 'beard',
  'bed', 'bee', 'belt', 'bench', 'bicycle', 'binoculars', 'bird',
  'birthday cake', 'blackberry', 'blueberry', 'book', 'boomerang',
  'bottlecap', 'bowtie', 'bracelet', 'brain', 'bread', 'bridge',
  'broccoli', 'broom', 'bucket', 'bulldozer', 'bus', 'bush', 'butterfly',
  'cactus', 'cake', 'calculator', 'calendar', 'camel', 'camera',
  'camouflage', 'campfire', 'candle', 'cannon', 'canoe', 'car', 'carrot',
  'castle', 'cat', 'ceiling fan', 'cello', 'cell phone', 'chair',
  'chandelier', 'church', 'circle', 'clarinet', 'clock', 'cloud',
  'coffee cup', 'compass', 'computer', 'cookie', 'cooler', 'couch', 'cow',
  'crab', 'crayon', 'crocodile', 'crown', 'cruise ship', 'cup', 'diamond',
  'dishwasher', 'diving board', 'dog', 'dolphin', 'donut', 'door',
  'dragon', 'dresser', 'drill', 'drums', 'duck', 'dumbbell', 'ear',
  'elbow', 'elephant', 'envelope', 'eraser', 'eye', 'eyeglasses', 'face',
  'fan', 'feather', 'fence', 'finger', 'fire hydrant', 'fireplace',
  'firetruck', 'fish', 'flamingo', 'flashlight', 'flip flops',
  'floor lamp', 'flower', 'flying saucer', 'foot', 'fork', 'frog',
  'frying pan', 'garden', 'garden hose', 'giraffe', 'goatee', 'golf club',
  'grapes', 'grass', 'guitar', 'hamburger', 'hammer', 'hand', 'harp',
  'hat', 'headphones', 'hedgehog', 'helicopter', 'helmet', 'hexagon',
  'hockey puck', 'hockey stick', 'horse', 'hospital', 'hot air balloon',
  'hot dog', 'hot tub', 'hourglass', 'house', 'house plant', 'hurricane',
  'ice cream', 'jacket', 'jail', 'kangaroo', 'key', 'keyboard', 'knee',
  'knife', 'ladder', 'lantern', 'laptop', 'leaf', 'leg', 'light bulb',
  'lighter', 'lighthouse', 'lightning', 'line', 'lion', 'lipstick',
  'lobster', 'lollipop', 'mailbox', 'map', 'marker', 'matches',
  'megaphone', 'mermaid', 'microphone', 'microwave', 'monkey', 'moon',
  'mosquito', 'motorbike', 'mountain', 'mouse', 'moustache', 'mouth',
  'mug', 'mushroom', 'nail', 'necklace', 'nose', 'ocean', 'octagon',
  'octopus', 'onion', 'oven', 'owl', 'paintbrush', 'paint can',
  'palm tree', 'panda', 'pants', 'paper clip', 'parachute', 'parrot',
  'passport', 'peanut', 'pear', 'peas', 'pencil', 'penguin', 'piano',
  'pickup truck', 'picture frame', 'pig', 'pillow', 'pineapple', 'pizza',
  'pliers', 'police car', 'pond', 'pool', 'popsicle', 'postcard',
  'potato', 'power outlet', 'purse', 'rabbit', 'raccoon', 'radio', 'rain',
  'rainbow', 'rake', 'remote control', 'rhinoceros', 'rifle', 'river',
  'roller coaster', 'rollerskates', 'sailboat', 'sandwich', 'saw',
  'saxophone', 'school bus', 'scissors', 'scorpion', 'screwdriver',
  'sea turtle', 'see saw', 'shark', 'sheep', 'shoe', 'shorts', 'shovel',
  'sink', 'skateboard', 'skull', 'skyscraper', 'sleeping bag',
  'smiley face', 'snail', 'snake', 'snorkel', 'snowflake', 'snowman',
  'soccer ball', 'sock', 'speedboat', 'spider', 'spoon', 'spreadsheet',
  'square', 'squiggle', 'squirrel', 'stairs', 'star', 'steak', 'stereo',
  'stethoscope', 'stitches', 'stop sign', 'stove', 'strawberry',
  'streetlight', 'string bean', 'submarine', 'suitcase', 'sun', 'swan',
  'sweater', 'swing set', 'sword', 'syringe', 't-shirt', 'table',
  'teapot', 'teddy-bear', 'telephone', 'television', 'tennis racquet',
  'tent', 'The Eiffel Tower', 'The Great Wall of China',
  'The Mona Lisa', 'tiger', 'toaster', 'toe', 'toilet', 'tooth',
  'toothbrush', 'toothpaste', 'tornado', 'tractor', 'traffic light',
  'train', 'tree', 'triangle', 'trombone', 'truck', 'trumpet', 'umbrella',
  'underwear', 'van', 'vase', 'violin', 'washing machine', 'watermelon',
  'waterslide', 'whale', 'wheel', 'windmill', 'wine bottle', 'wine glass',
  'wristwatch', 'yoga', 'zebra', 'zigzag',
];

/**
 * Normalized set for O(1) lookup.
 * Keys are lowercased, trimmed, punctuation-stripped versions.
 */
const _normalizedSet: Set<string> = new Set(
  QUICKDRAW_CATEGORIES.map(w => w.toLowerCase().trim())
);

/**
 * Check if a word is a known QuickDraw category.
 */
export function isSupportedCategory(word: string): boolean {
  const normalized = word.toLowerCase().trim().replace(/[^a-z0-9 -]/g, '');
  return _normalizedSet.has(normalized);
}

/**
 * Find the best matching category name for a word.
 * Tries exact match, then without spaces, then partial word matches.
 */
export function findCategory(word: string): string | null {
  const normalized = word.toLowerCase().trim().replace(/[^a-z0-9 -]/g, '');

  // Direct match
  if (_normalizedSet.has(normalized)) return normalized;

  // Without spaces
  const noSpace = normalized.replace(/ /g, '');
  for (const cat of QUICKDRAW_CATEGORIES) {
    if (cat.toLowerCase().replace(/ /g, '') === noSpace) return cat.toLowerCase();
  }

  // Contains match (e.g., "birthday cake" found when word is "birthday cake")
  for (const cat of QUICKDRAW_CATEGORIES) {
    const catLower = cat.toLowerCase();
    if (catLower.includes(normalized) || normalized.includes(catLower)) {
      return catLower;
    }
  }

  // Individual word match (e.g., word "cake" matches "birthday cake" or just "cake")
  const parts = normalized.split(' ');
  for (const part of parts) {
    if (part.length < 3) continue; // skip tiny words
    for (const cat of QUICKDRAW_CATEGORIES) {
      if (cat.toLowerCase() === part) return cat.toLowerCase();
    }
  }

  return null;
}

/**
 * Get the total number of supported categories.
 */
export function getCategoryCount(): number {
  return QUICKDRAW_CATEGORIES.length;
}
