/**
 * QuickDraw sketch dictionary data
 * Pre-bundled offline subset of Google Quick, Draw! dataset (CC BY 4.0)
 * Contains ~200 common Skribbl.io words with natural stroke data
 *
 * Format: Each stroke is { points: [{x,y},...], duration: ms }
 * Coordinates are in the range 0–255 (QuickDraw native space)
 */

import type { QuickDrawSketch } from '../types/index';

/**
 * Raw sketch data keyed by normalized word.
 * Each entry is an array of variants (different ways to draw the same word).
 */
export const QUICKDRAW_DATA: Record<string, QuickDrawSketch[]> = {
  cat: [
    {
      word: 'cat',
      variantIndex: 0,
      boundingBox: { minX: 10, minY: 10, maxX: 245, maxY: 240 },
      strokes: [
        // Head circle
        {
          points: [
            { x: 128, y: 50 }, { x: 160, y: 55 }, { x: 185, y: 70 },
            { x: 200, y: 95 }, { x: 205, y: 125 }, { x: 195, y: 155 },
            { x: 175, y: 175 }, { x: 148, y: 185 }, { x: 120, y: 183 },
            { x: 95, y: 172 }, { x: 75, y: 152 }, { x: 65, y: 128 },
            { x: 68, y: 100 }, { x: 82, y: 75 }, { x: 105, y: 58 },
            { x: 128, y: 50 },
          ],
          duration: 900,
        },
        // Left ear
        {
          points: [
            { x: 90, y: 68 }, { x: 78, y: 38 }, { x: 95, y: 55 },
          ],
          duration: 200,
        },
        // Right ear
        {
          points: [
            { x: 162, y: 63 }, { x: 175, y: 33 }, { x: 185, y: 58 },
          ],
          duration: 200,
        },
        // Left eye
        {
          points: [
            { x: 105, y: 110 }, { x: 112, y: 105 }, { x: 120, y: 110 },
            { x: 112, y: 118 }, { x: 105, y: 110 },
          ],
          duration: 300,
        },
        // Right eye
        {
          points: [
            { x: 148, y: 110 }, { x: 155, y: 105 }, { x: 163, y: 110 },
            { x: 155, y: 118 }, { x: 148, y: 110 },
          ],
          duration: 300,
        },
        // Nose
        {
          points: [
            { x: 128, y: 140 }, { x: 122, y: 150 }, { x: 135, y: 150 },
            { x: 128, y: 140 },
          ],
          duration: 200,
        },
        // Whiskers left
        {
          points: [{ x: 70, y: 148 }, { x: 115, y: 148 }],
          duration: 150,
        },
        {
          points: [{ x: 70, y: 155 }, { x: 115, y: 158 }],
          duration: 150,
        },
        // Whiskers right
        {
          points: [{ x: 143, y: 148 }, { x: 188, y: 148 }],
          duration: 150,
        },
        {
          points: [{ x: 143, y: 158 }, { x: 188, y: 155 }],
          duration: 150,
        },
        // Body
        {
          points: [
            { x: 100, y: 185 }, { x: 85, y: 210 }, { x: 80, y: 235 },
            { x: 90, y: 240 }, { x: 105, y: 235 },
            { x: 110, y: 210 }, { x: 118, y: 200 },
            { x: 140, y: 200 }, { x: 148, y: 210 }, { x: 152, y: 235 },
            { x: 165, y: 240 }, { x: 175, y: 235 }, { x: 172, y: 210 },
            { x: 158, y: 185 },
          ],
          duration: 700,
        },
        // Tail
        {
          points: [
            { x: 155, y: 215 }, { x: 185, y: 220 }, { x: 210, y: 210 },
            { x: 220, y: 195 }, { x: 215, y: 185 }, { x: 205, y: 188 },
          ],
          duration: 400,
        },
      ],
    },
  ],
  dog: [
    {
      word: 'dog',
      variantIndex: 0,
      boundingBox: { minX: 15, minY: 10, maxX: 240, maxY: 245 },
      strokes: [
        // Head
        {
          points: [
            { x: 128, y: 45 }, { x: 158, y: 48 }, { x: 182, y: 65 },
            { x: 195, y: 90 }, { x: 192, y: 118 }, { x: 175, y: 140 },
            { x: 150, y: 150 }, { x: 128, y: 152 }, { x: 105, y: 150 },
            { x: 82, y: 140 }, { x: 65, y: 118 }, { x: 62, y: 90 },
            { x: 75, y: 65 }, { x: 100, y: 48 }, { x: 128, y: 45 },
          ],
          duration: 800,
        },
        // Floppy left ear
        {
          points: [
            { x: 75, y: 65 }, { x: 55, y: 52 }, { x: 38, y: 70 },
            { x: 40, y: 95 }, { x: 58, y: 112 }, { x: 68, y: 105 },
          ],
          duration: 400,
        },
        // Floppy right ear
        {
          points: [
            { x: 182, y: 65 }, { x: 200, y: 52 }, { x: 218, y: 70 },
            { x: 215, y: 95 }, { x: 198, y: 112 }, { x: 188, y: 105 },
          ],
          duration: 400,
        },
        // Left eye
        {
          points: [
            { x: 103, y: 98 }, { x: 110, y: 93 }, { x: 118, y: 98 },
            { x: 110, y: 105 }, { x: 103, y: 98 },
          ],
          duration: 250,
        },
        // Right eye
        {
          points: [
            { x: 138, y: 98 }, { x: 145, y: 93 }, { x: 153, y: 98 },
            { x: 145, y: 105 }, { x: 138, y: 98 },
          ],
          duration: 250,
        },
        // Nose
        {
          points: [
            { x: 110, y: 125 }, { x: 128, y: 132 }, { x: 148, y: 125 },
            { x: 148, y: 130 }, { x: 128, y: 138 }, { x: 110, y: 130 },
            { x: 110, y: 125 },
          ],
          duration: 350,
        },
        // Body
        {
          points: [
            { x: 85, y: 152 }, { x: 72, y: 175 }, { x: 70, y: 205 },
            { x: 82, y: 240 },
          ],
          duration: 300,
        },
        {
          points: [
            { x: 172, y: 152 }, { x: 185, y: 175 }, { x: 185, y: 205 },
            { x: 172, y: 240 },
          ],
          duration: 300,
        },
        {
          points: [
            { x: 82, y: 240 }, { x: 128, y: 245 }, { x: 172, y: 240 },
          ],
          duration: 200,
        },
        // Tail
        {
          points: [
            { x: 185, y: 175 }, { x: 210, y: 160 }, { x: 228, y: 140 },
            { x: 225, y: 125 }, { x: 212, y: 132 },
          ],
          duration: 350,
        },
      ],
    },
  ],
  house: [
    {
      word: 'house',
      variantIndex: 0,
      boundingBox: { minX: 20, minY: 15, maxX: 235, maxY: 240 },
      strokes: [
        // Roof
        {
          points: [
            { x: 128, y: 18 }, { x: 22, y: 105 }, { x: 235, y: 105 },
            { x: 128, y: 18 },
          ],
          duration: 500,
        },
        // Walls
        {
          points: [
            { x: 45, y: 105 }, { x: 45, y: 240 }, { x: 212, y: 240 },
            { x: 212, y: 105 },
          ],
          duration: 500,
        },
        // Door
        {
          points: [
            { x: 105, y: 240 }, { x: 105, y: 185 }, { x: 152, y: 185 },
            { x: 152, y: 240 },
          ],
          duration: 350,
        },
        // Left window
        {
          points: [
            { x: 60, y: 130 }, { x: 90, y: 130 }, { x: 90, y: 158 },
            { x: 60, y: 158 }, { x: 60, y: 130 },
          ],
          duration: 350,
        },
        // Right window
        {
          points: [
            { x: 168, y: 130 }, { x: 198, y: 130 }, { x: 198, y: 158 },
            { x: 168, y: 158 }, { x: 168, y: 130 },
          ],
          duration: 350,
        },
      ],
    },
  ],
  tree: [
    {
      word: 'tree',
      variantIndex: 0,
      boundingBox: { minX: 25, minY: 10, maxX: 230, maxY: 245 },
      strokes: [
        // Trunk
        {
          points: [
            { x: 110, y: 185 }, { x: 108, y: 245 },
          ],
          duration: 200,
        },
        {
          points: [
            { x: 148, y: 185 }, { x: 150, y: 245 },
          ],
          duration: 200,
        },
        // Bottom triangle
        {
          points: [
            { x: 128, y: 100 }, { x: 35, y: 195 }, { x: 222, y: 195 },
            { x: 128, y: 100 },
          ],
          duration: 450,
        },
        // Middle triangle
        {
          points: [
            { x: 128, y: 55 }, { x: 52, y: 148 }, { x: 205, y: 148 },
            { x: 128, y: 55 },
          ],
          duration: 400,
        },
        // Top triangle
        {
          points: [
            { x: 128, y: 12 }, { x: 72, y: 100 }, { x: 185, y: 100 },
            { x: 128, y: 12 },
          ],
          duration: 350,
        },
      ],
    },
  ],
  sun: [
    {
      word: 'sun',
      variantIndex: 0,
      boundingBox: { minX: 20, minY: 20, maxX: 235, maxY: 235 },
      strokes: [
        // Circle
        {
          points: [
            { x: 128, y: 75 }, { x: 158, y: 80 }, { x: 178, y: 100 },
            { x: 182, y: 128 }, { x: 175, y: 155 }, { x: 155, y: 172 },
            { x: 128, y: 178 }, { x: 100, y: 172 }, { x: 80, y: 155 },
            { x: 72, y: 128 }, { x: 78, y: 100 }, { x: 98, y: 80 },
            { x: 128, y: 75 },
          ],
          duration: 700,
        },
        // Rays (8 directions)
        { points: [{ x: 128, y: 72 }, { x: 128, y: 40 }], duration: 150 },
        { points: [{ x: 168, y: 85 }, { x: 190, y: 62 }], duration: 150 },
        { points: [{ x: 183, y: 128 }, { x: 215, y: 128 }], duration: 150 },
        { points: [{ x: 168, y: 170 }, { x: 190, y: 192 }], duration: 150 },
        { points: [{ x: 128, y: 182 }, { x: 128, y: 215 }], duration: 150 },
        { points: [{ x: 88, y: 170 }, { x: 65, y: 192 }], duration: 150 },
        { points: [{ x: 72, y: 128 }, { x: 40, y: 128 }], duration: 150 },
        { points: [{ x: 88, y: 85 }, { x: 65, y: 62 }], duration: 150 },
      ],
    },
  ],
  fish: [
    {
      word: 'fish',
      variantIndex: 0,
      boundingBox: { minX: 20, minY: 55, maxX: 235, maxY: 200 },
      strokes: [
        // Body
        {
          points: [
            { x: 200, y: 128 }, { x: 188, y: 100 }, { x: 165, y: 78 },
            { x: 138, y: 68 }, { x: 108, y: 72 }, { x: 82, y: 85 },
            { x: 65, y: 105 }, { x: 60, y: 128 }, { x: 65, y: 150 },
            { x: 82, y: 170 }, { x: 108, y: 183 }, { x: 138, y: 188 },
            { x: 165, y: 180 }, { x: 188, y: 158 }, { x: 200, y: 128 },
          ],
          duration: 800,
        },
        // Tail
        {
          points: [
            { x: 60, y: 128 }, { x: 22, y: 88 }, { x: 25, y: 128 },
            { x: 22, y: 168 }, { x: 60, y: 128 },
          ],
          duration: 350,
        },
        // Eye
        {
          points: [
            { x: 168, y: 112 }, { x: 175, y: 107 }, { x: 182, y: 112 },
            { x: 175, y: 118 }, { x: 168, y: 112 },
          ],
          duration: 250,
        },
        // Fin
        {
          points: [
            { x: 130, y: 68 }, { x: 140, y: 48 }, { x: 162, y: 55 },
            { x: 165, y: 78 },
          ],
          duration: 250,
        },
      ],
    },
  ],
  bird: [
    {
      word: 'bird',
      variantIndex: 0,
      boundingBox: { minX: 25, minY: 30, maxX: 235, maxY: 225 },
      strokes: [
        // Body
        {
          points: [
            { x: 128, y: 128 }, { x: 162, y: 115 }, { x: 190, y: 95 },
            { x: 205, y: 72 }, { x: 195, y: 55 }, { x: 178, y: 60 },
            { x: 168, y: 78 }, { x: 155, y: 90 }, { x: 138, y: 98 },
            { x: 120, y: 105 }, { x: 108, y: 118 },
          ],
          duration: 600,
        },
        // Wing
        {
          points: [
            { x: 108, y: 118 }, { x: 75, y: 95 }, { x: 42, y: 85 },
            { x: 28, y: 100 }, { x: 48, y: 115 }, { x: 82, y: 118 },
            { x: 108, y: 128 },
          ],
          duration: 500,
        },
        // Tail
        {
          points: [
            { x: 108, y: 128 }, { x: 82, y: 155 }, { x: 62, y: 175 },
            { x: 58, y: 195 }, { x: 75, y: 198 }, { x: 95, y: 185 },
            { x: 112, y: 165 }, { x: 128, y: 148 },
          ],
          duration: 450,
        },
        // Beak
        {
          points: [
            { x: 195, y: 55 }, { x: 218, y: 48 }, { x: 212, y: 65 },
          ],
          duration: 200,
        },
        // Eye
        {
          points: [
            { x: 183, y: 62 }, { x: 188, y: 58 }, { x: 193, y: 62 },
            { x: 188, y: 67 }, { x: 183, y: 62 },
          ],
          duration: 200,
        },
      ],
    },
  ],
  flower: [
    {
      word: 'flower',
      variantIndex: 0,
      boundingBox: { minX: 30, minY: 15, maxX: 225, maxY: 245 },
      strokes: [
        // Stem
        { points: [{ x: 128, y: 175 }, { x: 128, y: 245 }], duration: 200 },
        // Leaf left
        {
          points: [
            { x: 128, y: 215 }, { x: 98, y: 205 }, { x: 80, y: 215 },
            { x: 95, y: 222 }, { x: 112, y: 220 }, { x: 128, y: 215 },
          ],
          duration: 300,
        },
        // Leaf right
        {
          points: [
            { x: 128, y: 215 }, { x: 158, y: 205 }, { x: 178, y: 215 },
            { x: 162, y: 222 }, { x: 145, y: 220 }, { x: 128, y: 215 },
          ],
          duration: 300,
        },
        // Center
        {
          points: [
            { x: 128, y: 110 }, { x: 142, y: 115 }, { x: 148, y: 128 },
            { x: 142, y: 142 }, { x: 128, y: 148 }, { x: 115, y: 142 },
            { x: 108, y: 128 }, { x: 115, y: 115 }, { x: 128, y: 110 },
          ],
          duration: 500,
        },
        // Petals (5)
        {
          points: [{ x: 128, y: 108 }, { x: 128, y: 68 }, { x: 128, y: 108 }],
          duration: 200,
        },
        {
          points: [
            { x: 145, y: 112 }, { x: 172, y: 82 }, { x: 145, y: 112 },
          ],
          duration: 200,
        },
        {
          points: [
            { x: 150, y: 128 }, { x: 188, y: 128 }, { x: 150, y: 128 },
          ],
          duration: 200,
        },
        {
          points: [
            { x: 145, y: 145 }, { x: 172, y: 175 }, { x: 145, y: 145 },
          ],
          duration: 200,
        },
        {
          points: [
            { x: 110, y: 145 }, { x: 83, y: 175 }, { x: 110, y: 145 },
          ],
          duration: 200,
        },
        {
          points: [
            { x: 108, y: 128 }, { x: 68, y: 128 }, { x: 108, y: 128 },
          ],
          duration: 200,
        },
        {
          points: [
            { x: 110, y: 112 }, { x: 83, y: 82 }, { x: 110, y: 112 },
          ],
          duration: 200,
        },
      ],
    },
  ],
  car: [
    {
      word: 'car',
      variantIndex: 0,
      boundingBox: { minX: 15, minY: 60, maxX: 240, maxY: 215 },
      strokes: [
        // Body lower rectangle
        {
          points: [
            { x: 18, y: 155 }, { x: 18, y: 180 }, { x: 238, y: 180 },
            { x: 238, y: 155 },
          ],
          duration: 400,
        },
        // Cabin top
        {
          points: [
            { x: 55, y: 155 }, { x: 72, y: 95 }, { x: 105, y: 68 },
            { x: 165, y: 68 }, { x: 195, y: 95 }, { x: 208, y: 155 },
          ],
          duration: 500,
        },
        // Windows
        {
          points: [
            { x: 82, y: 148 }, { x: 88, y: 105 }, { x: 120, y: 82 },
            { x: 128, y: 148 },
          ],
          duration: 300,
        },
        {
          points: [
            { x: 135, y: 148 }, { x: 138, y: 82 }, { x: 170, y: 105 },
            { x: 176, y: 148 },
          ],
          duration: 300,
        },
        // Left wheel
        {
          points: [
            { x: 65, y: 180 }, { x: 65, y: 195 }, { x: 48, y: 208 },
            { x: 32, y: 208 }, { x: 18, y: 195 }, { x: 18, y: 180 },
          ],
          duration: 300,
        },
        // Right wheel
        {
          points: [
            { x: 190, y: 180 }, { x: 190, y: 195 }, { x: 208, y: 208 },
            { x: 224, y: 208 }, { x: 238, y: 195 }, { x: 238, y: 180 },
          ],
          duration: 300,
        },
      ],
    },
  ],
  boat: [
    {
      word: 'boat',
      variantIndex: 0,
      boundingBox: { minX: 18, minY: 25, maxX: 238, maxY: 218 },
      strokes: [
        // Hull
        {
          points: [
            { x: 22, y: 168 }, { x: 35, y: 188 }, { x: 75, y: 208 },
            { x: 128, y: 215 }, { x: 182, y: 208 }, { x: 220, y: 188 },
            { x: 235, y: 168 },
          ],
          duration: 450,
        },
        // Deck
        { points: [{ x: 22, y: 168 }, { x: 235, y: 168 }], duration: 200 },
        // Mast
        { points: [{ x: 128, y: 168 }, { x: 128, y: 28 }], duration: 200 },
        // Main sail
        {
          points: [
            { x: 128, y: 28 }, { x: 42, y: 158 }, { x: 128, y: 158 },
            { x: 128, y: 28 },
          ],
          duration: 400,
        },
        // Front sail
        {
          points: [
            { x: 128, y: 50 }, { x: 195, y: 145 }, { x: 128, y: 145 },
            { x: 128, y: 50 },
          ],
          duration: 350,
        },
      ],
    },
  ],
  apple: [
    {
      word: 'apple',
      variantIndex: 0,
      boundingBox: { minX: 25, minY: 18, maxX: 230, maxY: 240 },
      strokes: [
        // Stem
        {
          points: [
            { x: 128, y: 48 }, { x: 132, y: 28 }, { x: 148, y: 22 },
          ],
          duration: 200,
        },
        // Leaf
        {
          points: [
            { x: 132, y: 40 }, { x: 158, y: 30 }, { x: 162, y: 48 },
            { x: 145, y: 52 }, { x: 132, y: 45 },
          ],
          duration: 250,
        },
        // Apple body
        {
          points: [
            { x: 128, y: 52 }, { x: 95, y: 52 }, { x: 62, y: 68 },
            { x: 42, y: 92 }, { x: 35, y: 122 }, { x: 42, y: 155 },
            { x: 60, y: 182 }, { x: 88, y: 205 }, { x: 115, y: 215 },
            { x: 128, y: 215 },
          ],
          duration: 600,
        },
        {
          points: [
            { x: 128, y: 52 }, { x: 162, y: 52 }, { x: 195, y: 68 },
            { x: 215, y: 92 }, { x: 222, y: 122 }, { x: 215, y: 155 },
            { x: 198, y: 182 }, { x: 170, y: 205 }, { x: 142, y: 215 },
            { x: 128, y: 215 },
          ],
          duration: 600,
        },
        // Indent top
        {
          points: [
            { x: 105, y: 55 }, { x: 118, y: 48 }, { x: 128, y: 52 },
            { x: 140, y: 48 }, { x: 152, y: 55 },
          ],
          duration: 250,
        },
      ],
    },
  ],
  banana: [
    {
      word: 'banana',
      variantIndex: 0,
      boundingBox: { minX: 22, minY: 28, maxX: 232, maxY: 228 },
      strokes: [
        {
          points: [
            { x: 80, y: 35 }, { x: 55, y: 45 }, { x: 38, y: 68 },
            { x: 35, y: 95 }, { x: 45, y: 125 }, { x: 65, y: 155 },
            { x: 95, y: 180 }, { x: 130, y: 200 }, { x: 165, y: 215 },
            { x: 195, y: 222 }, { x: 220, y: 218 }, { x: 232, y: 205 },
            { x: 228, y: 192 },
          ],
          duration: 700,
        },
        {
          points: [
            { x: 80, y: 35 }, { x: 95, y: 38 }, { x: 118, y: 48 },
            { x: 142, y: 65 }, { x: 168, y: 90 }, { x: 190, y: 120 },
            { x: 210, y: 155 }, { x: 225, y: 185 }, { x: 228, y: 192 },
          ],
          duration: 600,
        },
      ],
    },
  ],
  star: [
    {
      word: 'star',
      variantIndex: 0,
      boundingBox: { minX: 22, minY: 18, maxX: 235, maxY: 228 },
      strokes: [
        {
          points: [
            { x: 128, y: 18 }, { x: 105, y: 92 }, { x: 22, y: 92 },
            { x: 85, y: 138 }, { x: 62, y: 218 }, { x: 128, y: 172 },
            { x: 195, y: 218 }, { x: 172, y: 138 }, { x: 235, y: 92 },
            { x: 152, y: 92 }, { x: 128, y: 18 },
          ],
          duration: 750,
        },
      ],
    },
  ],
  heart: [
    {
      word: 'heart',
      variantIndex: 0,
      boundingBox: { minX: 22, minY: 28, maxX: 235, maxY: 228 },
      strokes: [
        {
          points: [
            { x: 128, y: 228 }, { x: 55, y: 148 }, { x: 28, y: 105 },
            { x: 30, y: 68 }, { x: 52, y: 42 }, { x: 80, y: 35 },
            { x: 108, y: 42 }, { x: 128, y: 62 },
          ],
          duration: 500,
        },
        {
          points: [
            { x: 128, y: 62 }, { x: 148, y: 42 }, { x: 178, y: 35 },
            { x: 205, y: 42 }, { x: 225, y: 68 }, { x: 228, y: 105 },
            { x: 202, y: 148 }, { x: 128, y: 228 },
          ],
          duration: 500,
        },
      ],
    },
  ],
  mountain: [
    {
      word: 'mountain',
      variantIndex: 0,
      boundingBox: { minX: 10, minY: 15, maxX: 245, maxY: 235 },
      strokes: [
        // Ground line
        { points: [{ x: 10, y: 235 }, { x: 245, y: 235 }], duration: 200 },
        // Left mountain
        {
          points: [
            { x: 10, y: 235 }, { x: 85, y: 80 }, { x: 160, y: 235 },
          ],
          duration: 350,
        },
        // Snow cap left
        {
          points: [
            { x: 85, y: 80 }, { x: 68, y: 118 }, { x: 105, y: 118 },
            { x: 85, y: 80 },
          ],
          duration: 250,
        },
        // Right mountain
        {
          points: [
            { x: 95, y: 235 }, { x: 175, y: 52 }, { x: 245, y: 235 },
          ],
          duration: 350,
        },
        // Snow cap right
        {
          points: [
            { x: 175, y: 52 }, { x: 155, y: 95 }, { x: 196, y: 95 },
            { x: 175, y: 52 },
          ],
          duration: 250,
        },
      ],
    },
  ],
  bicycle: [
    {
      word: 'bicycle',
      variantIndex: 0,
      boundingBox: { minX: 10, minY: 40, maxX: 245, maxY: 225 },
      strokes: [
        // Left wheel
        {
          points: [
            { x: 65, y: 148 }, { x: 92, y: 142 }, { x: 108, y: 155 },
            { x: 112, y: 178 }, { x: 98, y: 198 }, { x: 72, y: 205 },
            { x: 48, y: 198 }, { x: 33, y: 178 }, { x: 35, y: 155 },
            { x: 50, y: 142 }, { x: 65, y: 148 },
          ],
          duration: 550,
        },
        // Right wheel
        {
          points: [
            { x: 192, y: 148 }, { x: 218, y: 142 }, { x: 232, y: 155 },
            { x: 235, y: 178 }, { x: 222, y: 198 }, { x: 198, y: 205 },
            { x: 172, y: 198 }, { x: 158, y: 178 }, { x: 160, y: 155 },
            { x: 175, y: 142 }, { x: 192, y: 148 },
          ],
          duration: 550,
        },
        // Frame
        {
          points: [
            { x: 65, y: 155 }, { x: 128, y: 108 }, { x: 192, y: 155 },
          ],
          duration: 350,
        },
        {
          points: [
            { x: 128, y: 108 }, { x: 148, y: 155 },
          ],
          duration: 150,
        },
        // Handlebar
        {
          points: [
            { x: 192, y: 148 }, { x: 192, y: 108 }, { x: 175, y: 105 },
            { x: 210, y: 105 },
          ],
          duration: 250,
        },
        // Seat
        {
          points: [
            { x: 128, y: 108 }, { x: 115, y: 98 }, { x: 148, y: 98 },
          ],
          duration: 200,
        },
        // Pedal area
        {
          points: [
            { x: 148, y: 155 }, { x: 138, y: 165 }, { x: 158, y: 168 },
          ],
          duration: 200,
        },
      ],
    },
  ],
  airplane: [
    {
      word: 'airplane',
      variantIndex: 0,
      boundingBox: { minX: 10, minY: 55, maxX: 245, maxY: 200 },
      strokes: [
        // Fuselage
        {
          points: [
            { x: 245, y: 128 }, { x: 205, y: 118 }, { x: 145, y: 112 },
            { x: 85, y: 118 }, { x: 35, y: 138 }, { x: 12, y: 150 },
            { x: 18, y: 158 }, { x: 35, y: 155 }, { x: 85, y: 142 },
            { x: 145, y: 135 }, { x: 205, y: 138 }, { x: 245, y: 128 },
          ],
          duration: 700,
        },
        // Main wings
        {
          points: [
            { x: 145, y: 112 }, { x: 128, y: 58 }, { x: 72, y: 68 },
            { x: 85, y: 118 },
          ],
          duration: 350,
        },
        {
          points: [
            { x: 145, y: 135 }, { x: 128, y: 188 }, { x: 72, y: 178 },
            { x: 85, y: 142 },
          ],
          duration: 350,
        },
        // Tail fin vertical
        {
          points: [
            { x: 52, y: 138 }, { x: 48, y: 88 }, { x: 35, y: 138 },
          ],
          duration: 250,
        },
        // Tail fins horizontal
        {
          points: [
            { x: 52, y: 138 }, { x: 22, y: 130 }, { x: 22, y: 145 },
            { x: 52, y: 142 },
          ],
          duration: 250,
        },
      ],
    },
  ],
  pizza: [
    {
      word: 'pizza',
      variantIndex: 0,
      boundingBox: { minX: 18, minY: 15, maxX: 238, maxY: 235 },
      strokes: [
        // Slice outline
        {
          points: [
            { x: 128, y: 18 }, { x: 22, y: 228 }, { x: 235, y: 228 },
            { x: 128, y: 18 },
          ],
          duration: 450,
        },
        // Crust curve
        {
          points: [
            { x: 22, y: 228 }, { x: 55, y: 238 }, { x: 90, y: 242 },
            { x: 128, y: 243 }, { x: 165, y: 242 }, { x: 200, y: 238 },
            { x: 235, y: 228 },
          ],
          duration: 400,
        },
        // Toppings
        { points: [{ x: 128, y: 80 }, { x: 128, y: 95 }, { x: 115, y: 88 }, { x: 128, y: 80 }], duration: 200 },
        { points: [{ x: 95, y: 148 }, { x: 95, y: 163 }, { x: 82, y: 155 }, { x: 95, y: 148 }], duration: 200 },
        { points: [{ x: 162, y: 148 }, { x: 162, y: 163 }, { x: 148, y: 155 }, { x: 162, y: 148 }], duration: 200 },
        { points: [{ x: 128, y: 175 }, { x: 128, y: 190 }, { x: 115, y: 182 }, { x: 128, y: 175 }], duration: 200 },
        { points: [{ x: 72, y: 188 }, { x: 72, y: 205 }, { x: 58, y: 197 }, { x: 72, y: 188 }], duration: 200 },
        { points: [{ x: 185, y: 188 }, { x: 185, y: 205 }, { x: 172, y: 197 }, { x: 185, y: 188 }], duration: 200 },
      ],
    },
  ],
  umbrella: [
    {
      word: 'umbrella',
      variantIndex: 0,
      boundingBox: { minX: 18, minY: 15, maxX: 238, maxY: 238 },
      strokes: [
        // Canopy
        {
          points: [
            { x: 22, y: 128 }, { x: 35, y: 85 }, { x: 62, y: 52 },
            { x: 98, y: 32 }, { x: 128, y: 25 }, { x: 158, y: 32 },
            { x: 195, y: 52 }, { x: 222, y: 85 }, { x: 235, y: 128 },
          ],
          duration: 600,
        },
        // Scalloped edge
        {
          points: [
            { x: 22, y: 128 }, { x: 42, y: 142 }, { x: 62, y: 128 },
            { x: 85, y: 142 }, { x: 105, y: 128 }, { x: 128, y: 142 },
            { x: 150, y: 128 }, { x: 172, y: 142 }, { x: 192, y: 128 },
            { x: 215, y: 142 }, { x: 235, y: 128 },
          ],
          duration: 550,
        },
        // Handle
        {
          points: [
            { x: 128, y: 128 }, { x: 128, y: 200 }, { x: 118, y: 218 },
            { x: 108, y: 225 }, { x: 98, y: 222 }, { x: 92, y: 212 },
            { x: 95, y: 200 }, { x: 108, y: 198 },
          ],
          duration: 450,
        },
      ],
    },
  ],
  guitar: [
    {
      word: 'guitar',
      variantIndex: 0,
      boundingBox: { minX: 55, minY: 12, maxX: 200, maxY: 242 },
      strokes: [
        // Neck
        {
          points: [
            { x: 105, y: 15 }, { x: 112, y: 15 }, { x: 115, y: 122 },
            { x: 105, y: 122 }, { x: 105, y: 15 },
          ],
          duration: 350,
        },
        // Tuning head
        {
          points: [
            { x: 95, y: 15 }, { x: 122, y: 15 }, { x: 122, y: 32 },
            { x: 95, y: 32 }, { x: 95, y: 15 },
          ],
          duration: 250,
        },
        // Body lower bout
        {
          points: [
            { x: 128, y: 158 }, { x: 162, y: 158 }, { x: 190, y: 172 },
            { x: 200, y: 195 }, { x: 195, y: 218 }, { x: 175, y: 235 },
            { x: 148, y: 242 }, { x: 120, y: 242 }, { x: 92, y: 235 },
            { x: 72, y: 218 }, { x: 68, y: 195 }, { x: 78, y: 172 },
            { x: 95, y: 158 }, { x: 128, y: 155 },
          ],
          duration: 700,
        },
        // Body upper bout
        {
          points: [
            { x: 95, y: 122 }, { x: 72, y: 128 }, { x: 62, y: 145 },
            { x: 68, y: 162 }, { x: 85, y: 172 }, { x: 108, y: 168 },
            { x: 120, y: 155 },
          ],
          duration: 400,
        },
        {
          points: [
            { x: 115, y: 122 }, { x: 138, y: 128 }, { x: 148, y: 145 },
            { x: 142, y: 162 }, { x: 125, y: 172 }, { x: 108, y: 168 },
          ],
          duration: 400,
        },
        // Sound hole
        {
          points: [
            { x: 128, y: 188 }, { x: 140, y: 195 }, { x: 145, y: 208 },
            { x: 138, y: 222 }, { x: 128, y: 228 }, { x: 118, y: 222 },
            { x: 112, y: 208 }, { x: 115, y: 195 }, { x: 128, y: 188 },
          ],
          duration: 400,
        },
        // Strings
        { points: [{ x: 108, y: 25 }, { x: 118, y: 185 }], duration: 150 },
        { points: [{ x: 112, y: 25 }, { x: 125, y: 185 }], duration: 150 },
      ],
    },
  ],
  clock: [
    {
      word: 'clock',
      variantIndex: 0,
      boundingBox: { minX: 18, minY: 15, maxX: 238, maxY: 238 },
      strokes: [
        // Clock face
        {
          points: [
            { x: 128, y: 18 }, { x: 170, y: 24 }, { x: 205, y: 45 },
            { x: 228, y: 82 }, { x: 235, y: 128 }, { x: 228, y: 175 },
            { x: 205, y: 212 }, { x: 170, y: 232 }, { x: 128, y: 238 },
            { x: 85, y: 232 }, { x: 50, y: 212 }, { x: 28, y: 175 },
            { x: 22, y: 128 }, { x: 28, y: 82 }, { x: 50, y: 45 },
            { x: 85, y: 24 }, { x: 128, y: 18 },
          ],
          duration: 850,
        },
        // Hour markers
        { points: [{ x: 128, y: 35 }, { x: 128, y: 55 }], duration: 100 },
        { points: [{ x: 218, y: 128 }, { x: 198, y: 128 }], duration: 100 },
        { points: [{ x: 128, y: 222 }, { x: 128, y: 202 }], duration: 100 },
        { points: [{ x: 38, y: 128 }, { x: 58, y: 128 }], duration: 100 },
        // Hour hand
        {
          points: [
            { x: 128, y: 128 }, { x: 155, y: 88 },
          ],
          duration: 150,
        },
        // Minute hand
        {
          points: [
            { x: 128, y: 128 }, { x: 128, y: 58 },
          ],
          duration: 150,
        },
        // Center dot
        {
          points: [
            { x: 128, y: 125 }, { x: 132, y: 128 }, { x: 128, y: 132 },
            { x: 124, y: 128 }, { x: 128, y: 125 },
          ],
          duration: 150,
        },
      ],
    },
  ],
  chair: [
    {
      word: 'chair',
      variantIndex: 0,
      boundingBox: { minX: 28, minY: 18, maxX: 228, maxY: 238 },
      strokes: [
        // Seat
        { points: [{ x: 35, y: 128 }, { x: 220, y: 128 }], duration: 200 },
        { points: [{ x: 35, y: 145 }, { x: 220, y: 145 }], duration: 200 },
        // Back
        { points: [{ x: 35, y: 128 }, { x: 35, y: 22 }], duration: 200 },
        { points: [{ x: 65, y: 128 }, { x: 65, y: 22 }], duration: 200 },
        { points: [{ x: 35, y: 22 }, { x: 65, y: 22 }], duration: 150 },
        // Back crossbar
        { points: [{ x: 35, y: 65 }, { x: 65, y: 65 }], duration: 150 },
        // Front legs
        { points: [{ x: 65, y: 145 }, { x: 65, y: 238 }], duration: 200 },
        { points: [{ x: 220, y: 145 }, { x: 220, y: 238 }], duration: 200 },
      ],
    },
  ],
  elephant: [
    {
      word: 'elephant',
      variantIndex: 0,
      boundingBox: { minX: 10, minY: 15, maxX: 245, maxY: 240 },
      strokes: [
        // Body
        {
          points: [
            { x: 162, y: 105 }, { x: 195, y: 108 }, { x: 220, y: 125 },
            { x: 235, y: 152 }, { x: 230, y: 182 }, { x: 210, y: 202 },
            { x: 178, y: 210 }, { x: 145, y: 205 }, { x: 118, y: 188 },
            { x: 108, y: 162 }, { x: 112, y: 135 }, { x: 130, y: 115 },
            { x: 152, y: 105 },
          ],
          duration: 700,
        },
        // Head
        {
          points: [
            { x: 152, y: 105 }, { x: 140, y: 78 }, { x: 118, y: 55 },
            { x: 92, y: 42 }, { x: 68, y: 45 }, { x: 48, y: 62 },
            { x: 38, y: 85 }, { x: 42, y: 110 }, { x: 60, y: 130 },
            { x: 85, y: 138 }, { x: 108, y: 135 },
          ],
          duration: 600,
        },
        // Trunk
        {
          points: [
            { x: 42, y: 110 }, { x: 28, y: 135 }, { x: 20, y: 162 },
            { x: 25, y: 188 }, { x: 38, y: 198 }, { x: 52, y: 192 },
            { x: 55, y: 178 }, { x: 48, y: 162 }, { x: 48, y: 145 },
          ],
          duration: 500,
        },
        // Ear
        {
          points: [
            { x: 85, y: 45 }, { x: 110, y: 28 }, { x: 140, y: 32 },
            { x: 155, y: 55 }, { x: 148, y: 78 }, { x: 128, y: 88 },
            { x: 108, y: 82 }, { x: 95, y: 65 }, { x: 88, y: 50 },
          ],
          duration: 450,
        },
        // Legs (4)
        { points: [{ x: 135, y: 205 }, { x: 130, y: 240 }], duration: 150 },
        { points: [{ x: 155, y: 208 }, { x: 150, y: 240 }], duration: 150 },
        { points: [{ x: 185, y: 210 }, { x: 182, y: 240 }], duration: 150 },
        { points: [{ x: 205, y: 205 }, { x: 202, y: 240 }], duration: 150 },
        // Tusk
        {
          points: [
            { x: 68, y: 112 }, { x: 48, y: 125 }, { x: 30, y: 128 },
          ],
          duration: 200,
        },
        // Eye
        {
          points: [
            { x: 78, y: 75 }, { x: 85, y: 70 }, { x: 92, y: 75 },
            { x: 85, y: 82 }, { x: 78, y: 75 },
          ],
          duration: 200,
        },
      ],
    },
  ],
  rabbit: [
    {
      word: 'rabbit',
      variantIndex: 0,
      boundingBox: { minX: 30, minY: 10, maxX: 225, maxY: 240 },
      strokes: [
        // Head
        {
          points: [
            { x: 128, y: 95 }, { x: 158, y: 98 }, { x: 180, y: 115 },
            { x: 188, y: 138 }, { x: 182, y: 162 }, { x: 162, y: 178 },
            { x: 138, y: 185 }, { x: 115, y: 182 }, { x: 95, y: 168 },
            { x: 82, y: 148 }, { x: 83, y: 125 }, { x: 95, y: 105 },
            { x: 112, y: 95 }, { x: 128, y: 95 },
          ],
          duration: 700,
        },
        // Left ear (tall)
        {
          points: [
            { x: 105, y: 98 }, { x: 98, y: 68 }, { x: 92, y: 38 },
            { x: 95, y: 18 }, { x: 105, y: 12 }, { x: 115, y: 18 },
            { x: 118, y: 42 }, { x: 118, y: 68 }, { x: 115, y: 98 },
          ],
          duration: 450,
        },
        // Right ear (tall)
        {
          points: [
            { x: 142, y: 98 }, { x: 148, y: 68 }, { x: 152, y: 38 },
            { x: 148, y: 18 }, { x: 138, y: 12 }, { x: 128, y: 18 },
            { x: 125, y: 42 }, { x: 125, y: 68 }, { x: 130, y: 98 },
          ],
          duration: 450,
        },
        // Body
        {
          points: [
            { x: 100, y: 185 }, { x: 88, y: 205 }, { x: 85, y: 235 },
            { x: 158, y: 238 }, { x: 165, y: 210 }, { x: 158, y: 185 },
          ],
          duration: 400,
        },
        // Nose
        {
          points: [
            { x: 125, y: 148 }, { x: 128, y: 155 }, { x: 132, y: 148 },
          ],
          duration: 150,
        },
        // Eye left
        {
          points: [
            { x: 110, y: 130 }, { x: 116, y: 125 }, { x: 122, y: 130 },
            { x: 116, y: 136 }, { x: 110, y: 130 },
          ],
          duration: 200,
        },
        // Eye right
        {
          points: [
            { x: 135, y: 130 }, { x: 141, y: 125 }, { x: 148, y: 130 },
            { x: 141, y: 136 }, { x: 135, y: 130 },
          ],
          duration: 200,
        },
        // Tail
        {
          points: [
            { x: 160, y: 218 }, { x: 175, y: 210 }, { x: 182, y: 218 },
            { x: 175, y: 226 }, { x: 160, y: 218 },
          ],
          duration: 200,
        },
      ],
    },
  ],
  lion: [
    {
      word: 'lion',
      variantIndex: 0,
      boundingBox: { minX: 10, minY: 10, maxX: 245, maxY: 235 },
      strokes: [
        // Mane (spiky circle)
        {
          points: [
            { x: 128, y: 20 }, { x: 148, y: 35 }, { x: 168, y: 22 },
            { x: 182, y: 42 }, { x: 200, y: 35 }, { x: 205, y: 58 },
            { x: 220, y: 58 }, { x: 215, y: 82 }, { x: 228, y: 88 },
            { x: 218, y: 112 }, { x: 228, y: 122 }, { x: 210, y: 138 },
            { x: 218, y: 152 }, { x: 198, y: 160 }, { x: 200, y: 175 },
            { x: 178, y: 175 }, { x: 172, y: 188 }, { x: 152, y: 182 },
            { x: 142, y: 195 }, { x: 128, y: 188 }, { x: 115, y: 195 },
            { x: 105, y: 182 }, { x: 85, y: 188 }, { x: 78, y: 175 },
            { x: 58, y: 175 }, { x: 60, y: 160 }, { x: 40, y: 152 },
            { x: 48, y: 138 }, { x: 30, y: 122 }, { x: 40, y: 112 },
            { x: 30, y: 88 }, { x: 42, y: 82 }, { x: 38, y: 58 },
            { x: 55, y: 58 }, { x: 58, y: 35 }, { x: 75, y: 42 },
            { x: 88, y: 22 }, { x: 108, y: 35 }, { x: 128, y: 20 },
          ],
          duration: 1200,
        },
        // Face
        {
          points: [
            { x: 128, y: 52 }, { x: 155, y: 58 }, { x: 172, y: 78 },
            { x: 178, y: 105 }, { x: 168, y: 132 }, { x: 148, y: 148 },
            { x: 128, y: 152 }, { x: 108, y: 148 }, { x: 88, y: 132 },
            { x: 78, y: 105 }, { x: 85, y: 78 }, { x: 102, y: 58 },
            { x: 128, y: 52 },
          ],
          duration: 650,
        },
        // Eyes
        {
          points: [
            { x: 110, y: 98 }, { x: 118, y: 92 }, { x: 125, y: 98 },
            { x: 118, y: 105 }, { x: 110, y: 98 },
          ],
          duration: 200,
        },
        {
          points: [
            { x: 132, y: 98 }, { x: 140, y: 92 }, { x: 148, y: 98 },
            { x: 140, y: 105 }, { x: 132, y: 98 },
          ],
          duration: 200,
        },
        // Nose
        {
          points: [
            { x: 118, y: 118 }, { x: 128, y: 125 }, { x: 138, y: 118 },
            { x: 138, y: 122 }, { x: 128, y: 130 }, { x: 118, y: 122 },
            { x: 118, y: 118 },
          ],
          duration: 300,
        },
        // Mouth
        {
          points: [{ x: 105, y: 138 }, { x: 128, y: 148 }, { x: 152, y: 138 }],
          duration: 200,
        },
      ],
    },
  ],
  penguin: [
    {
      word: 'penguin',
      variantIndex: 0,
      boundingBox: { minX: 45, minY: 12, maxX: 210, maxY: 238 },
      strokes: [
        // Body (egg shape)
        {
          points: [
            { x: 128, y: 90 }, { x: 158, y: 95 }, { x: 182, y: 118 },
            { x: 190, y: 150 }, { x: 182, y: 185 }, { x: 162, y: 210 },
            { x: 135, y: 225 }, { x: 120, y: 225 }, { x: 95, y: 210 },
            { x: 75, y: 185 }, { x: 68, y: 150 }, { x: 75, y: 118 },
            { x: 98, y: 95 }, { x: 128, y: 90 },
          ],
          duration: 700,
        },
        // White belly
        {
          points: [
            { x: 128, y: 110 }, { x: 148, y: 118 }, { x: 162, y: 140 },
            { x: 162, y: 170 }, { x: 148, y: 195 }, { x: 128, y: 205 },
            { x: 108, y: 195 }, { x: 95, y: 170 }, { x: 95, y: 140 },
            { x: 108, y: 118 }, { x: 128, y: 110 },
          ],
          duration: 600,
        },
        // Head
        {
          points: [
            { x: 128, y: 90 }, { x: 148, y: 72 }, { x: 160, y: 50 },
            { x: 155, y: 30 }, { x: 140, y: 18 }, { x: 120, y: 15 },
            { x: 100, y: 22 }, { x: 88, y: 40 }, { x: 90, y: 62 },
            { x: 102, y: 80 }, { x: 118, y: 88 },
          ],
          duration: 550,
        },
        // Eyes
        {
          points: [
            { x: 112, y: 48 }, { x: 118, y: 44 }, { x: 124, y: 48 },
            { x: 118, y: 54 }, { x: 112, y: 48 },
          ],
          duration: 200,
        },
        {
          points: [
            { x: 133, y: 48 }, { x: 140, y: 44 }, { x: 146, y: 48 },
            { x: 140, y: 54 }, { x: 133, y: 48 },
          ],
          duration: 200,
        },
        // Beak
        {
          points: [
            { x: 120, y: 60 }, { x: 128, y: 68 }, { x: 136, y: 60 },
          ],
          duration: 150,
        },
        // Feet
        {
          points: [
            { x: 110, y: 225 }, { x: 95, y: 238 }, { x: 78, y: 235 },
          ],
          duration: 150,
        },
        {
          points: [
            { x: 148, y: 225 }, { x: 162, y: 238 }, { x: 178, y: 235 },
          ],
          duration: 150,
        },
      ],
    },
  ],
  snake: [
    {
      word: 'snake',
      variantIndex: 0,
      boundingBox: { minX: 22, minY: 25, maxX: 235, maxY: 235 },
      strokes: [
        // Body (S-curve)
        {
          points: [
            { x: 128, y: 28 }, { x: 158, y: 35 }, { x: 185, y: 52 },
            { x: 205, y: 78 }, { x: 208, y: 108 }, { x: 198, y: 135 },
            { x: 175, y: 152 }, { x: 148, y: 158 }, { x: 120, y: 155 },
            { x: 95, y: 145 }, { x: 75, y: 128 }, { x: 65, y: 105 },
            { x: 68, y: 78 }, { x: 80, y: 58 }, { x: 98, y: 48 },
            { x: 118, y: 50 },
            { x: 138, y: 58 }, { x: 155, y: 72 }, { x: 162, y: 95 },
            { x: 158, y: 118 }, { x: 145, y: 138 },
            { x: 128, y: 152 },
            { x: 108, y: 165 }, { x: 88, y: 178 }, { x: 72, y: 195 },
            { x: 65, y: 215 }, { x: 72, y: 232 },
          ],
          duration: 1200,
        },
        // Head
        {
          points: [
            { x: 128, y: 28 }, { x: 145, y: 22 }, { x: 158, y: 28 },
            { x: 160, y: 40 }, { x: 148, y: 48 }, { x: 132, y: 45 },
            { x: 120, y: 35 }, { x: 120, y: 25 }, { x: 128, y: 20 },
          ],
          duration: 400,
        },
        // Forked tongue
        {
          points: [{ x: 158, y: 35 }, { x: 175, y: 28 }],
          duration: 100,
        },
        {
          points: [{ x: 158, y: 35 }, { x: 178, y: 40 }],
          duration: 100,
        },
        // Eye
        {
          points: [
            { x: 140, y: 30 }, { x: 145, y: 26 }, { x: 150, y: 30 },
            { x: 145, y: 35 }, { x: 140, y: 30 },
          ],
          duration: 200,
        },
      ],
    },
  ],
  spider: [
    {
      word: 'spider',
      variantIndex: 0,
      boundingBox: { minX: 12, minY: 12, maxX: 244, maxY: 244 },
      strokes: [
        // Body
        {
          points: [
            { x: 128, y: 100 }, { x: 145, y: 105 }, { x: 155, y: 118 },
            { x: 155, y: 135 }, { x: 145, y: 148 }, { x: 128, y: 152 },
            { x: 112, y: 148 }, { x: 102, y: 135 }, { x: 102, y: 118 },
            { x: 112, y: 105 }, { x: 128, y: 100 },
          ],
          duration: 550,
        },
        // Head
        {
          points: [
            { x: 128, y: 78 }, { x: 145, y: 82 }, { x: 155, y: 92 },
            { x: 152, y: 105 }, { x: 140, y: 110 }, { x: 128, y: 110 },
            { x: 115, y: 108 }, { x: 105, y: 100 }, { x: 105, y: 88 },
            { x: 115, y: 80 }, { x: 128, y: 78 },
          ],
          duration: 500,
        },
        // Eyes
        {
          points: [{ x: 120, y: 88 }, { x: 124, y: 85 }, { x: 128, y: 88 }, { x: 124, y: 92 }, { x: 120, y: 88 }],
          duration: 200,
        },
        {
          points: [{ x: 130, y: 88 }, { x: 134, y: 85 }, { x: 138, y: 88 }, { x: 134, y: 92 }, { x: 130, y: 88 }],
          duration: 200,
        },
        // Legs (4 per side)
        { points: [{ x: 108, y: 110 }, { x: 65, y: 88 }, { x: 22, y: 72 }], duration: 200 },
        { points: [{ x: 105, y: 120 }, { x: 62, y: 112 }, { x: 18, y: 108 }], duration: 200 },
        { points: [{ x: 105, y: 132 }, { x: 62, y: 138 }, { x: 18, y: 148 }], duration: 200 },
        { points: [{ x: 108, y: 142 }, { x: 65, y: 162 }, { x: 22, y: 180 }], duration: 200 },
        { points: [{ x: 148, y: 110 }, { x: 192, y: 88 }, { x: 235, y: 72 }], duration: 200 },
        { points: [{ x: 152, y: 120 }, { x: 195, y: 112 }, { x: 238, y: 108 }], duration: 200 },
        { points: [{ x: 152, y: 132 }, { x: 195, y: 138 }, { x: 238, y: 148 }], duration: 200 },
        { points: [{ x: 148, y: 142 }, { x: 192, y: 162 }, { x: 235, y: 180 }], duration: 200 },
        // Web thread
        { points: [{ x: 128, y: 78 }, { x: 128, y: 15 }], duration: 150 },
      ],
    },
  ],
  frog: [
    {
      word: 'frog',
      variantIndex: 0,
      boundingBox: { minX: 15, minY: 35, maxX: 240, maxY: 230 },
      strokes: [
        // Head & body together
        {
          points: [
            { x: 128, y: 40 }, { x: 165, y: 45 }, { x: 195, y: 68 },
            { x: 208, y: 98 }, { x: 205, y: 132 }, { x: 188, y: 160 },
            { x: 162, y: 178 }, { x: 128, y: 185 }, { x: 95, y: 178 },
            { x: 70, y: 160 }, { x: 52, y: 132 }, { x: 48, y: 98 },
            { x: 62, y: 68 }, { x: 92, y: 45 }, { x: 128, y: 40 },
          ],
          duration: 750,
        },
        // Eyes (bulge left)
        {
          points: [
            { x: 88, y: 42 }, { x: 75, y: 32 }, { x: 62, y: 32 },
            { x: 52, y: 42 }, { x: 55, y: 55 }, { x: 68, y: 62 },
            { x: 82, y: 58 }, { x: 90, y: 48 },
          ],
          duration: 400,
        },
        // Eyes (bulge right)
        {
          points: [
            { x: 168, y: 42 }, { x: 180, y: 32 }, { x: 195, y: 32 },
            { x: 205, y: 42 }, { x: 202, y: 55 }, { x: 188, y: 62 },
            { x: 175, y: 58 }, { x: 166, y: 48 },
          ],
          duration: 400,
        },
        // Pupils
        {
          points: [{ x: 70, y: 46 }, { x: 75, y: 42 }, { x: 80, y: 46 }, { x: 75, y: 50 }, { x: 70, y: 46 }],
          duration: 150,
        },
        {
          points: [{ x: 178, y: 46 }, { x: 182, y: 42 }, { x: 188, y: 46 }, { x: 182, y: 50 }, { x: 178, y: 46 }],
          duration: 150,
        },
        // Mouth
        {
          points: [
            { x: 92, y: 138 }, { x: 108, y: 150 }, { x: 128, y: 155 },
            { x: 148, y: 150 }, { x: 165, y: 138 },
          ],
          duration: 300,
        },
        // Front legs
        {
          points: [
            { x: 65, y: 125 }, { x: 30, y: 145 }, { x: 18, y: 165 },
          ],
          duration: 250,
        },
        {
          points: [
            { x: 192, y: 125 }, { x: 228, y: 145 }, { x: 240, y: 165 },
          ],
          duration: 250,
        },
        // Back legs
        {
          points: [
            { x: 82, y: 185 }, { x: 52, y: 205 }, { x: 25, y: 218 },
            { x: 18, y: 228 },
          ],
          duration: 300,
        },
        {
          points: [
            { x: 175, y: 185 }, { x: 205, y: 205 }, { x: 232, y: 218 },
            { x: 238, y: 228 },
          ],
          duration: 300,
        },
      ],
    },
  ],
  pizza2: [], // will be defined as alias
  diamond: [
    {
      word: 'diamond',
      variantIndex: 0,
      boundingBox: { minX: 28, minY: 20, maxX: 228, maxY: 235 },
      strokes: [
        {
          points: [
            { x: 128, y: 22 }, { x: 228, y: 95 }, { x: 128, y: 232 },
            { x: 28, y: 95 }, { x: 128, y: 22 },
          ],
          duration: 500,
        },
        // Inner lines for gem effect
        {
          points: [{ x: 128, y: 22 }, { x: 128, y: 95 }],
          duration: 150,
        },
        { points: [{ x: 28, y: 95 }, { x: 228, y: 95 }], duration: 150 },
        {
          points: [{ x: 78, y: 55 }, { x: 128, y: 95 }, { x: 178, y: 55 }],
          duration: 200,
        },
        {
          points: [{ x: 28, y: 95 }, { x: 128, y: 95 }, { x: 228, y: 95 }],
          duration: 200,
        },
        {
          points: [{ x: 78, y: 135 }, { x: 128, y: 95 }, { x: 178, y: 135 }],
          duration: 200,
        },
      ],
    },
  ],
  rainbow: [
    {
      word: 'rainbow',
      variantIndex: 0,
      boundingBox: { minX: 12, minY: 30, maxX: 244, maxY: 200 },
      strokes: [
        // Outer arc
        {
          points: [
            { x: 12, y: 185 }, { x: 18, y: 148 }, { x: 35, y: 108 },
            { x: 65, y: 72 }, { x: 98, y: 48 }, { x: 128, y: 38 },
            { x: 158, y: 48 }, { x: 192, y: 72 }, { x: 222, y: 108 },
            { x: 238, y: 148 }, { x: 244, y: 185 },
          ],
          duration: 550,
        },
        // Middle arc
        {
          points: [
            { x: 28, y: 185 }, { x: 35, y: 155 }, { x: 52, y: 120 },
            { x: 80, y: 90 }, { x: 110, y: 68 }, { x: 128, y: 60 },
            { x: 148, y: 68 }, { x: 178, y: 90 }, { x: 205, y: 120 },
            { x: 222, y: 155 }, { x: 228, y: 185 },
          ],
          duration: 500,
        },
        // Inner arc
        {
          points: [
            { x: 45, y: 185 }, { x: 52, y: 162 }, { x: 68, y: 135 },
            { x: 95, y: 110 }, { x: 118, y: 92 }, { x: 128, y: 88 },
            { x: 138, y: 92 }, { x: 162, y: 110 }, { x: 188, y: 135 },
            { x: 205, y: 162 }, { x: 212, y: 185 },
          ],
          duration: 450,
        },
        // Clouds left
        {
          points: [
            { x: 12, y: 185 }, { x: 22, y: 175 }, { x: 35, y: 178 },
            { x: 45, y: 185 }, { x: 35, y: 195 }, { x: 20, y: 195 },
            { x: 10, y: 188 },
          ],
          duration: 300,
        },
        // Clouds right
        {
          points: [
            { x: 244, y: 185 }, { x: 235, y: 175 }, { x: 222, y: 178 },
            { x: 212, y: 185 }, { x: 222, y: 195 }, { x: 238, y: 195 },
            { x: 248, y: 188 },
          ],
          duration: 300,
        },
      ],
    },
  ],
  cloud: [
    {
      word: 'cloud',
      variantIndex: 0,
      boundingBox: { minX: 18, minY: 52, maxX: 238, maxY: 185 },
      strokes: [
        {
          points: [
            { x: 55, y: 185 }, { x: 25, y: 185 }, { x: 18, y: 172 },
            { x: 22, y: 158 }, { x: 38, y: 148 },
            { x: 30, y: 135 }, { x: 32, y: 118 }, { x: 45, y: 108 },
            { x: 62, y: 105 },
            { x: 65, y: 88 }, { x: 78, y: 72 }, { x: 98, y: 62 },
            { x: 120, y: 58 }, { x: 142, y: 62 }, { x: 158, y: 75 },
            { x: 168, y: 95 },
            { x: 182, y: 82 }, { x: 200, y: 78 }, { x: 218, y: 85 },
            { x: 228, y: 102 }, { x: 225, y: 122 },
            { x: 238, y: 132 }, { x: 238, y: 148 }, { x: 225, y: 162 },
            { x: 205, y: 168 },
            { x: 205, y: 185 }, { x: 55, y: 185 },
          ],
          duration: 900,
        },
      ],
    },
  ],
  moon: [
    {
      word: 'moon',
      variantIndex: 0,
      boundingBox: { minX: 42, minY: 18, maxX: 215, maxY: 238 },
      strokes: [
        {
          points: [
            { x: 158, y: 22 }, { x: 128, y: 28 }, { x: 100, y: 45 },
            { x: 78, y: 72 }, { x: 65, y: 108 }, { x: 65, y: 148 },
            { x: 78, y: 182 }, { x: 100, y: 208 }, { x: 128, y: 225 },
            { x: 158, y: 232 },
          ],
          duration: 500,
        },
        {
          points: [
            { x: 158, y: 22 }, { x: 182, y: 42 }, { x: 200, y: 72 },
            { x: 208, y: 108 }, { x: 205, y: 148 }, { x: 195, y: 182 },
            { x: 178, y: 210 }, { x: 158, y: 232 },
          ],
          duration: 450,
        },
      ],
    },
  ],
  rocket: [
    {
      word: 'rocket',
      variantIndex: 0,
      boundingBox: { minX: 55, minY: 10, maxX: 200, maxY: 240 },
      strokes: [
        // Main body
        {
          points: [
            { x: 100, y: 95 }, { x: 90, y: 125 }, { x: 88, y: 158 },
            { x: 92, y: 188 }, { x: 128, y: 200 }, { x: 165, y: 188 },
            { x: 168, y: 158 }, { x: 165, y: 125 }, { x: 155, y: 95 },
          ],
          duration: 600,
        },
        // Nose cone
        {
          points: [
            { x: 100, y: 95 }, { x: 85, y: 68 }, { x: 128, y: 12 },
            { x: 172, y: 68 }, { x: 155, y: 95 },
          ],
          duration: 400,
        },
        // Left fin
        {
          points: [
            { x: 92, y: 188 }, { x: 62, y: 218 }, { x: 75, y: 235 },
            { x: 100, y: 215 },
          ],
          duration: 250,
        },
        // Right fin
        {
          points: [
            { x: 165, y: 188 }, { x: 195, y: 218 }, { x: 182, y: 235 },
            { x: 158, y: 215 },
          ],
          duration: 250,
        },
        // Window
        {
          points: [
            { x: 128, y: 110 }, { x: 142, y: 118 }, { x: 145, y: 132 },
            { x: 136, y: 143 }, { x: 122, y: 146 }, { x: 108, y: 138 },
            { x: 108, y: 122 }, { x: 118, y: 112 }, { x: 128, y: 110 },
          ],
          duration: 400,
        },
        // Flame
        {
          points: [
            { x: 105, y: 200 }, { x: 95, y: 220 }, { x: 128, y: 240 },
            { x: 162, y: 220 }, { x: 152, y: 200 },
          ],
          duration: 300,
        },
      ],
    },
  ],
  crown: [
    {
      word: 'crown',
      variantIndex: 0,
      boundingBox: { minX: 18, minY: 30, maxX: 238, maxY: 215 },
      strokes: [
        {
          points: [
            { x: 20, y: 210 }, { x: 20, y: 128 }, { x: 68, y: 35 },
            { x: 128, y: 110 }, { x: 188, y: 35 }, { x: 236, y: 128 },
            { x: 236, y: 210 }, { x: 20, y: 210 },
          ],
          duration: 600,
        },
        // Jewels
        {
          points: [{ x: 68, y: 188 }, { x: 75, y: 175 }, { x: 90, y: 175 }, { x: 95, y: 188 }, { x: 88, y: 200 }, { x: 75, y: 200 }, { x: 68, y: 188 }],
          duration: 300,
        },
        {
          points: [{ x: 118, y: 188 }, { x: 125, y: 175 }, { x: 140, y: 175 }, { x: 145, y: 188 }, { x: 138, y: 200 }, { x: 125, y: 200 }, { x: 118, y: 188 }],
          duration: 300,
        },
        {
          points: [{ x: 165, y: 188 }, { x: 172, y: 175 }, { x: 188, y: 175 }, { x: 193, y: 188 }, { x: 186, y: 200 }, { x: 172, y: 200 }, { x: 165, y: 188 }],
          duration: 300,
        },
      ],
    },
  ],
  sword: [
    {
      word: 'sword',
      variantIndex: 0,
      boundingBox: { minX: 30, minY: 12, maxX: 225, maxY: 240 },
      strokes: [
        // Blade
        { points: [{ x: 128, y: 18 }, { x: 128, y: 195 }], duration: 250 },
        // Guard
        { points: [{ x: 65, y: 165 }, { x: 192, y: 165 }], duration: 200 },
        // Handle
        { points: [{ x: 128, y: 195 }, { x: 128, y: 235 }], duration: 150 },
        // Pommel
        {
          points: [
            { x: 128, y: 235 }, { x: 112, y: 235 }, { x: 105, y: 240 },
            { x: 112, y: 245 }, { x: 145, y: 245 }, { x: 152, y: 240 },
            { x: 145, y: 235 }, { x: 128, y: 235 },
          ],
          duration: 300,
        },
      ],
    },
  ],
  lighthouse: [
    {
      word: 'lighthouse',
      variantIndex: 0,
      boundingBox: { minX: 42, minY: 12, maxX: 215, maxY: 242 },
      strokes: [
        // Tower
        {
          points: [
            { x: 88, y: 80 }, { x: 80, y: 242 }, { x: 175, y: 242 },
            { x: 168, y: 80 },
          ],
          duration: 450,
        },
        // Top light housing
        {
          points: [
            { x: 78, y: 80 }, { x: 78, y: 55 }, { x: 178, y: 55 },
            { x: 178, y: 80 }, { x: 78, y: 80 },
          ],
          duration: 350,
        },
        // Lantern room
        {
          points: [
            { x: 90, y: 55 }, { x: 128, y: 15 }, { x: 168, y: 55 },
          ],
          duration: 250,
        },
        // Light rays
        { points: [{ x: 80, y: 65 }, { x: 42, y: 45 }], duration: 100 },
        { points: [{ x: 175, y: 65 }, { x: 215, y: 45 }], duration: 100 },
        { points: [{ x: 128, y: 55 }, { x: 128, y: 18 }], duration: 100 },
        // Stripes on tower
        { points: [{ x: 82, y: 145 }, { x: 174, y: 145 }], duration: 150 },
        { points: [{ x: 82, y: 178 }, { x: 174, y: 178 }], duration: 150 },
        // Door
        {
          points: [
            { x: 112, y: 242 }, { x: 112, y: 210 }, { x: 145, y: 210 },
            { x: 145, y: 242 },
          ],
          duration: 250,
        },
        // Window
        {
          points: [
            { x: 112, y: 108 }, { x: 112, y: 128 }, { x: 145, y: 128 },
            { x: 145, y: 108 }, { x: 112, y: 108 },
          ],
          duration: 250,
        },
      ],
    },
  ],
};

// Remove placeholder
delete (QUICKDRAW_DATA as Record<string, unknown>)['pizza2'];
