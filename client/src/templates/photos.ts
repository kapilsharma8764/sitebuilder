/**
 * Photographs used by the templates.
 *
 * Every id below was fetched and looked at before being listed, so the subject
 * matches the label — a restaurant template never opens with a picture of an
 * office. A wrong photo reads as carelessness faster than almost anything else
 * on a page.
 *
 * Unsplash's licence covers commercial use without permission or attribution.
 * The query string asks their CDN for a cropped, compressed, correctly sized
 * image rather than the full original, which is what keeps a template light.
 */

const BASE = 'https://images.unsplash.com/'

export function photo(id: string, width = 1200): string {
  return `${BASE}${id}?auto=format&fit=crop&w=${width}&q=80`
}

/** Named so the templates read as English rather than as ids. */
export const photos = {
  classroom: 'photo-1509062522246-3755977927d7',
  studentsSmiling: 'photo-1497486751825-1233686d5d80',
  library: 'photo-1427504494785-3a9ca7044f45',
  tutoring: 'photo-1524178232363-1fb2b075b655',
  workshopTable: 'photo-1517048676732-d65bc937f952',

  teamMeeting: 'photo-1521737604893-d14cc237f11d',
  planningWall: 'photo-1552664730-d307ca884978',
  celebrating: 'photo-1600880292203-757bb62b4baf',
  officeCorridor: 'photo-1497366754035-f200968a6e72',
  handshake: 'photo-1521791136064-7986c2920216',
  openPlanOffice: 'photo-1531973576160-7125cd663d86',

  restaurantDark: 'photo-1517248135467-4c7edcad34c4',
  restaurantWarm: 'photo-1552566626-52f8b828add9',
  platedDish: 'photo-1414235077428-338989a2e8c0',
  indianDish: 'photo-1517244683847-7456b63c5969',

  cafeIndustrial: 'photo-1555396273-367ea4eb4db5',
  cafePlants: 'photo-1554118811-1e0d58224f24',

  barbershop: 'photo-1585747860715-2ba37e788b70',
  cosmetics: 'photo-1596462502278-27bfdc403348',

  gymRoom: 'photo-1540497077202-7c8a3999166f',
  dumbbellRack: 'photo-1534438327276-14e5300c3a48',
  liftingWeights: 'photo-1583454110551-21f2fa2afe61',
  matWorkout: 'photo-1571019613454-1cb2f99b2d8b',

  livingRoomModern: 'photo-1600607687939-ce8a6c25118c',
  livingRoomBeige: 'photo-1616486338812-3dadae4b4ace',
  kitchen: 'photo-1556909114-f6e7ad7d3136',

  houseExterior: 'photo-1600585154340-be6161a56a0c',
  houseKeys: 'photo-1560518883-ce09059eeffa',
  architectPlans: 'photo-1503387762-592deb58ef4e',

  doctor: 'photo-1576091160399-112ba8d25d1d',
  dentalRoom: 'photo-1629909613654-28e377c37b09',
  clinicReception: 'photo-1519494026892-80bbd2d6fd0d',

  solarField: 'photo-1509391366360-2e959784a276',
  solarAerial: 'photo-1497440001374-f26997328c1b',
} as const

export type PhotoName = keyof typeof photos
