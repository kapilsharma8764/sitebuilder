import type { PhotoName } from './photos'
import type { WebsiteCategory } from '@/onboarding/profile'

/**
 * The words each kind of business starts with.
 *
 * Nothing here is filler. A coaching centre's template opens with what a
 * coaching centre would actually say, complete with plausible numbers and
 * reviews, because a template full of "Lorem ipsum" or "Your headline here"
 * gives the owner nothing to react to — and reacting is how people edit.
 *
 * These are starting points, not claims: the numbers are round and the reviews
 * are written to be replaced.
 */

export interface ContentPack {
  id: string
  /** Shown on the template card. */
  label: string
  category: WebsiteCategory
  /** Words a person might search the gallery for. */
  keywords: string[]

  name: string
  menu: string[]
  cta: string
  secondaryCta: string

  headline: string
  slogan: string
  about: string

  servicesTitle: string
  services: { icon: string; title: string; description: string }[]

  stats: { value: string; label: string }[]

  reviewsTitle: string
  reviews: { name: string; role: string; quote: string; rating: number }[]

  faq: { question: string; answer: string }[]

  galleryTitle: string
  photos: PhotoName[]

  contactTitle: string
  contactSubtitle: string
}

export const contentPacks: ContentPack[] = [
  {
    id: 'coaching',
    label: 'Coaching centre',
    category: 'education',
    keywords: ['coaching', 'tuition', 'classes', 'exam', 'institute'],
    name: 'Sharma Coaching Classes',
    menu: ['Courses', 'Results', 'Faculty', 'Contact'],
    cta: 'Book a free class',
    secondaryCta: 'See courses',
    headline: 'Coaching that gets results',
    slogan: 'Small batches, senior teachers, and a plan for every student.',
    about:
      '## About us\n\nWe have been preparing students for board and competitive exams since 2011. Batches are capped at twenty so every student gets attention, and every parent gets a monthly progress call.\n\n- Doubt sessions six days a week\n- Weekly tests with detailed feedback\n- Separate revision batch before exams',
    servicesTitle: 'What we teach',
    services: [
      { icon: 'BookOpen', title: 'Board exams', description: 'Classes 9 to 12, all major boards, with past-paper practice every week.' },
      { icon: 'Target', title: 'Competitive exams', description: 'Focused batches for engineering and medical entrance preparation.' },
      { icon: 'Users', title: 'Foundation', description: 'Classes 6 to 8, building the basics that later years depend on.' },
    ],
    stats: [
      { value: '2,000+', label: 'Students taught' },
      { value: '14', label: 'Years running' },
      { value: '20', label: 'Students per batch' },
      { value: '92%', label: 'Scored above 80%' },
    ],
    reviewsTitle: 'What parents say',
    reviews: [
      { name: 'Anita Verma', role: 'Parent, Class 12', quote: 'The monthly calls made all the difference. We always knew where she stood and what to work on.', rating: 5 },
      { name: 'Rakesh Nair', role: 'Parent, Class 10', quote: 'Small batches were the reason we joined. My son actually asks questions in class now.', rating: 5 },
      { name: 'Priya Desai', role: 'Former student', quote: 'The weekly tests felt hard at the time. They are the reason the board exam felt easy.', rating: 5 },
    ],
    faq: [
      { question: 'When do new batches start?', answer: 'New batches begin in April and again in July. Mid-session admission is possible if a seat is free.' },
      { question: 'Do you offer a trial class?', answer: 'Yes. Attend one full class free before deciding, no payment or registration needed.' },
      { question: 'What are the fees?', answer: 'Fees depend on the class and subject count. Call us and we will explain the options for your child.' },
    ],
    galleryTitle: 'Inside the centre',
    photos: ['classroom', 'library', 'tutoring', 'studentsSmiling'],
    contactTitle: 'Book a free class',
    contactSubtitle: 'Tell us the class and subjects, and we will call you back the same day.',
  },

  {
    id: 'school',
    label: 'School',
    category: 'education',
    keywords: ['school', 'academy', 'admission', 'kindergarten'],
    name: 'Greenfield Academy',
    menu: ['About', 'Academics', 'Admissions', 'Contact'],
    cta: 'Apply for admission',
    secondaryCta: 'Visit the campus',
    headline: 'A school built around curiosity',
    slogan: 'Where children are taught to ask before they are taught to answer.',
    about:
      '## Our approach\n\nGreenfield opened in 2004 with forty children and three classrooms. We have grown, but the idea has not changed: small classes, teachers who stay, and a day that has as much room for play as for practice.\n\n- Classes capped at twenty-four\n- Library, science lab and playing field on campus\n- Parent–teacher meetings every term',
    servicesTitle: 'What we offer',
    services: [
      { icon: 'Sprout', title: 'Primary', description: 'Reading, numbers and confidence, in classrooms built for young children.' },
      { icon: 'FlaskConical', title: 'Middle school', description: 'Science and language taught with lab work and projects, not only textbooks.' },
      { icon: 'GraduationCap', title: 'Senior school', description: 'Board preparation with career counselling from Class 9 onwards.' },
    ],
    stats: [
      { value: '850', label: 'Students' },
      { value: '22', label: 'Years' },
      { value: '24', label: 'Class size' },
      { value: '60+', label: 'Teachers' },
    ],
    reviewsTitle: 'From our parents',
    reviews: [
      { name: 'Meera Joshi', role: 'Parent, Class 5', quote: 'Both our children went here. The teachers know them as people, not roll numbers.', rating: 5 },
      { name: 'Sanjay Gupta', role: 'Parent, Class 8', quote: 'The science lab is genuinely used. My daughter comes home talking about experiments.', rating: 5 },
      { name: 'Farah Sheikh', role: 'Parent, Class 2', quote: 'The admission process was clear and unhurried, which said a lot about the place.', rating: 4 },
    ],
    faq: [
      { question: 'When does admission open?', answer: 'Applications open in November for the session starting the following April.' },
      { question: 'Is there a school bus?', answer: 'Yes, on twelve routes across the city. Route maps are shared at admission.' },
      { question: 'Can we visit before applying?', answer: 'Please do. Campus visits run on weekday mornings — call ahead so a teacher can show you around.' },
    ],
    galleryTitle: 'Around campus',
    photos: ['classroom', 'library', 'studentsSmiling', 'tutoring'],
    contactTitle: 'Talk to the admissions office',
    contactSubtitle: 'Send us your child’s age and the class you are applying for.',
  },

  {
    id: 'restaurant',
    label: 'Restaurant',
    category: 'business',
    keywords: ['restaurant', 'food', 'dining', 'kitchen', 'menu'],
    name: 'Kesar Kitchen',
    menu: ['Menu', 'Our story', 'Gallery', 'Book a table'],
    cta: 'Book a table',
    secondaryCta: 'See the menu',
    headline: 'Slow food, honest spice',
    slogan: 'Recipes from three generations, cooked fresh every evening.',
    about:
      '## Our story\n\nKesar Kitchen began as a family kitchen and became a restaurant almost by accident. The masalas are still ground in-house, the paneer still arrives every morning, and the dal still takes six hours.\n\n- Everything cooked to order\n- Vegetarian and non-vegetarian menus\n- Private dining for up to thirty',
    servicesTitle: 'What we serve',
    services: [
      { icon: 'ChefHat', title: 'Regional thalis', description: 'A rotating thali built around what the market had that morning.' },
      { icon: 'Flame', title: 'Tandoor', description: 'Breads and kebabs from a clay oven fired twice a day.' },
      { icon: 'PartyPopper', title: 'Private dining', description: 'A separate room for birthdays, anniversaries and small office dinners.' },
    ],
    stats: [
      { value: '18', label: 'Years open' },
      { value: '4.7', label: 'Average rating' },
      { value: '60', label: 'Seats' },
      { value: '40+', label: 'Dishes' },
    ],
    reviewsTitle: 'What guests say',
    reviews: [
      { name: 'Deepak Rao', role: 'Regular since 2016', quote: 'The dal is worth the wait. I have stopped ordering it anywhere else.', rating: 5 },
      { name: 'Lisa Fernandes', role: 'Visited last week', quote: 'We booked the private room for twelve. Warm service, and nothing arrived late.', rating: 5 },
      { name: 'Imran Qureshi', role: 'Local guide', quote: 'Consistent for years, which in this city is rarer than it should be.', rating: 4 },
    ],
    faq: [
      { question: 'Do you take reservations?', answer: 'Yes, and we recommend them on Friday and Saturday evenings. Call or use the form below.' },
      { question: 'Is there parking?', answer: 'Valet parking is available from 7 PM, and there is street parking behind the building.' },
      { question: 'Do you cater?', answer: 'We cater small events up to eighty people. Send us the date and headcount for a quote.' },
    ],
    galleryTitle: 'From the kitchen',
    photos: ['platedDish', 'indianDish', 'restaurantDark', 'restaurantWarm'],
    contactTitle: 'Book a table',
    contactSubtitle: 'Tell us the date, time and number of guests.',
  },

  {
    id: 'cafe',
    label: 'Café',
    category: 'business',
    keywords: ['cafe', 'coffee', 'bakery', 'brunch'],
    name: 'Third Window Coffee',
    menu: ['Menu', 'Beans', 'Find us', 'Contact'],
    cta: 'See today’s menu',
    secondaryCta: 'Find us',
    headline: 'Coffee worth sitting down for',
    slogan: 'Roasted in small batches, poured slowly, served all day.',
    about:
      '## About the café\n\nWe roast two blends and one single origin at a time, and change them when the season does. The kitchen bakes each morning, so what is on the counter at nine is rarely there at five.\n\n- House-roasted beans, sold by the bag\n- Full breakfast until noon\n- Plenty of plug sockets and no time limit',
    servicesTitle: 'What’s on',
    services: [
      { icon: 'Coffee', title: 'Filter and espresso', description: 'Two blends on bar daily, plus a rotating single origin on filter.' },
      { icon: 'Croissant', title: 'Baked each morning', description: 'Croissants, sourdough and cakes made in the kitchen behind the counter.' },
      { icon: 'Laptop', title: 'Room to work', description: 'Fast internet, real tables and staff who will not rush you out.' },
    ],
    stats: [
      { value: '6', label: 'Years' },
      { value: '2', label: 'Roasts on bar' },
      { value: '7am', label: 'Doors open' },
      { value: '4.8', label: 'Average rating' },
    ],
    reviewsTitle: 'Regulars say',
    reviews: [
      { name: 'Nikhil Bose', role: 'Comes most mornings', quote: 'The filter changes often enough that I have never got bored in three years.', rating: 5 },
      { name: 'Grace Mathew', role: 'Works here on Fridays', quote: 'Quiet enough to write in, busy enough not to feel odd sitting alone.', rating: 5 },
      { name: 'Tarun Shah', role: 'Weekend visitor', quote: 'The sourdough sells out by lunch. That should tell you enough.', rating: 4 },
    ],
    faq: [
      { question: 'Do you sell beans?', answer: 'Yes, whole or ground, roasted within the week. Ask at the counter for the current roast.' },
      { question: 'Can I book the space?', answer: 'We host small evening events after 6 PM. Send us the date and number of people.' },
      { question: 'Do you have vegan options?', answer: 'Oat and soy milk at no extra charge, and at least two vegan bakes every day.' },
    ],
    galleryTitle: 'Inside',
    photos: ['cafeIndustrial', 'cafePlants', 'platedDish'],
    contactTitle: 'Say hello',
    contactSubtitle: 'Questions about beans, bookings or the kitchen — send them here.',
  },

  {
    id: 'barber',
    label: 'Barber shop',
    category: 'business',
    keywords: ['barber', 'salon', 'haircut', 'grooming', 'shave'],
    name: 'Craft & Blade',
    menu: ['Services', 'Prices', 'Our barbers', 'Book'],
    cta: 'Book an appointment',
    secondaryCta: 'See prices',
    headline: 'A proper haircut, every time',
    slogan: 'Walk in tired. Walk out sharp.',
    about:
      '## About the shop\n\nFour chairs, six barbers, and no rush. Every cut starts with a conversation about what you actually want, and ends with a hot towel.\n\n- Open seven days\n- Walk-ins welcome before noon\n- Beard trims, hot shaves and colour',
    servicesTitle: 'What we do',
    services: [
      { icon: 'Scissors', title: 'Haircut', description: 'Wash, cut and finish. Forty minutes, no shortcuts.' },
      { icon: 'Sparkles', title: 'Beard work', description: 'Shape, trim and hot-towel shave with a straight razor.' },
      { icon: 'Users', title: 'Father and son', description: 'Two chairs side by side, booked together at a reduced rate.' },
    ],
    stats: [
      { value: '12,000+', label: 'Cuts a year' },
      { value: '6', label: 'Barbers' },
      { value: '7', label: 'Days open' },
      { value: '4.9', label: 'Average rating' },
    ],
    reviewsTitle: 'What clients say',
    reviews: [
      { name: 'Arjun Mehta', role: 'Client since 2019', quote: 'First shop where I did not have to explain my hair twice. They remember.', rating: 5 },
      { name: 'Daniel Okoro', role: 'Monthly regular', quote: 'Booked online, in the chair on time, out in forty minutes. Every single visit.', rating: 5 },
      { name: 'Vikram Singh', role: 'Wedding party', quote: 'Six of us before a wedding. They opened early and got everyone done.', rating: 5 },
    ],
    faq: [
      { question: 'Do you take walk-ins?', answer: 'Before noon, usually yes. Afternoons and weekends are better booked ahead.' },
      { question: 'How much is a haircut?', answer: 'Prices are listed on the services page and do not change by barber.' },
      { question: 'Do you cut children’s hair?', answer: 'Yes, from age four upwards, and there is no extra charge for taking our time.' },
    ],
    galleryTitle: 'The shop',
    photos: ['barbershop', 'cosmetics'],
    contactTitle: 'Book a chair',
    contactSubtitle: 'Tell us the service and a time that suits you.',
  },

  {
    id: 'gym',
    label: 'Gym',
    category: 'business',
    keywords: ['gym', 'fitness', 'training', 'workout', 'crossfit'],
    name: 'Iron Yard Fitness',
    menu: ['Classes', 'Membership', 'Trainers', 'Join'],
    cta: 'Start a free week',
    secondaryCta: 'See classes',
    headline: 'Show up. We handle the rest.',
    slogan: 'Coached sessions, honest equipment, no contracts.',
    about:
      '## About the gym\n\nWe are a coaching gym, not a machine warehouse. Every member gets a plan, a check-in every six weeks, and a coach on the floor at all hours.\n\n- Month-to-month, cancel any time\n- Open 5 AM to 11 PM\n- Free assessment before you join',
    servicesTitle: 'How to train here',
    services: [
      { icon: 'Dumbbell', title: 'Strength', description: 'Barbell coaching in groups of six, three times a week.' },
      { icon: 'HeartPulse', title: 'Conditioning', description: 'Forty-five minute classes that finish what strength work starts.' },
      { icon: 'UserCheck', title: 'One to one', description: 'Personal training for injury recovery or a specific event.' },
    ],
    stats: [
      { value: '600+', label: 'Members' },
      { value: '18h', label: 'Open daily' },
      { value: '9', label: 'Coaches' },
      { value: '0', label: 'Lock-in contracts' },
    ],
    reviewsTitle: 'Member stories',
    reviews: [
      { name: 'Sneha Kulkarni', role: 'Member, 2 years', quote: 'I had never touched a barbell. Six weeks in someone showed me how, properly.', rating: 5 },
      { name: 'Marcus Bell', role: 'Member, 8 months', quote: 'No contract was the reason I tried it. The coaching is the reason I stayed.', rating: 5 },
      { name: 'Ritu Agarwal', role: 'Member, 3 years', quote: 'Came back after a knee injury. They rebuilt the plan around it rather than around me quitting.', rating: 5 },
    ],
    faq: [
      { question: 'Do I need to be fit already?', answer: 'No. Most people start with the assessment and a beginner plan built from it.' },
      { question: 'Is there a joining fee?', answer: 'No joining fee and no contract. Membership is monthly and you can stop any time.' },
      { question: 'Can I try before joining?', answer: 'Yes — a free week, including classes, with no card details taken.' },
    ],
    galleryTitle: 'The floor',
    photos: ['gymRoom', 'dumbbellRack', 'liftingWeights', 'matWorkout'],
    contactTitle: 'Start your free week',
    contactSubtitle: 'Send your name and a good time to call.',
  },

  {
    id: 'clinic',
    label: 'Clinic',
    category: 'business',
    keywords: ['clinic', 'doctor', 'dental', 'health', 'medical'],
    name: 'Meridian Dental Care',
    menu: ['Treatments', 'Our team', 'Fees', 'Book'],
    cta: 'Book an appointment',
    secondaryCta: 'See treatments',
    headline: 'Dentistry without the dread',
    slogan: 'Clear explanations, written estimates, and enough time for questions.',
    about:
      '## About the clinic\n\nWe run longer appointments than most clinics, because rushing is what makes dentistry frightening. Every treatment plan comes in writing with the cost before anything begins.\n\n- Written estimates before treatment\n- Emergency slots kept free daily\n- Sterilisation records available on request',
    servicesTitle: 'Treatments',
    services: [
      { icon: 'Stethoscope', title: 'Check-ups', description: 'A full examination, clean and X-rays where needed, in one visit.' },
      { icon: 'Smile', title: 'Cosmetic', description: 'Whitening, veneers and alignment, discussed before anything is booked.' },
      { icon: 'ShieldPlus', title: 'Emergency', description: 'Same-day slots held open every weekday for pain and breakages.' },
    ],
    stats: [
      { value: '15,000+', label: 'Patients treated' },
      { value: '20', label: 'Years' },
      { value: '4', label: 'Dentists' },
      { value: '24h', label: 'Emergency callback' },
    ],
    reviewsTitle: 'Patient feedback',
    reviews: [
      { name: 'Kavita Menon', role: 'Patient, 6 years', quote: 'They explained the plan and the cost before touching anything. That was new for me.', rating: 5 },
      { name: 'Thomas Varghese', role: 'Emergency visit', quote: 'Called at nine with a cracked tooth. Seen by eleven, fixed by noon.', rating: 5 },
      { name: 'Aisha Rahman', role: 'Patient, 2 years', quote: 'My son is not scared of the dentist. I did not think that was possible.', rating: 5 },
    ],
    faq: [
      { question: 'Do you take walk-ins?', answer: 'For emergencies, yes. Routine appointments should be booked so we can give you a full slot.' },
      { question: 'Will I know the cost beforehand?', answer: 'Always. Nothing begins until you have a written estimate and have agreed to it.' },
      { question: 'Do you treat children?', answer: 'Yes, from age three, with appointments timed so there is no rush.' },
    ],
    galleryTitle: 'The clinic',
    photos: ['dentalRoom', 'clinicReception', 'doctor'],
    contactTitle: 'Book an appointment',
    contactSubtitle: 'Tell us what you need and when suits you, and we will confirm by phone.',
  },

  {
    id: 'solar',
    label: 'Solar installer',
    category: 'business',
    keywords: ['solar', 'energy', 'panels', 'renewable', 'green'],
    name: 'Sunwatt Energy',
    menu: ['How it works', 'Savings', 'Projects', 'Get a quote'],
    cta: 'Get a free quote',
    secondaryCta: 'How it works',
    headline: 'Own your electricity',
    slogan: 'Rooftop solar, installed properly, paid back in years not decades.',
    about:
      '## About us\n\nWe survey, install and maintain rooftop solar for homes and small businesses. Every quote shows the real numbers: system size, expected generation, and the month your savings overtake the cost.\n\n- Free rooftop survey\n- Twenty-five year panel warranty\n- Subsidy paperwork handled for you',
    servicesTitle: 'What we do',
    services: [
      { icon: 'Sun', title: 'Home rooftop', description: 'Systems from 3 kW upwards, sized to your actual electricity bill.' },
      { icon: 'Factory', title: 'Commercial', description: 'Larger installations for offices, schools and small factories.' },
      { icon: 'Wrench', title: 'Maintenance', description: 'Cleaning and inspection twice a year to keep generation where it should be.' },
    ],
    stats: [
      { value: '1,200+', label: 'Rooftops fitted' },
      { value: '9 MW', label: 'Installed' },
      { value: '25 yr', label: 'Panel warranty' },
      { value: '4-6 yr', label: 'Typical payback' },
    ],
    reviewsTitle: 'From our customers',
    reviews: [
      { name: 'Harish Pillai', role: 'Home, 5 kW', quote: 'The quote predicted my generation within five percent. Two years on, still accurate.', rating: 5 },
      { name: 'Neelam Chopra', role: 'Home, 3 kW', quote: 'They handled the subsidy paperwork entirely. I signed twice and that was it.', rating: 5 },
      { name: 'Suresh Iyer', role: 'Factory, 80 kW', quote: 'Installed over a weekend so production never stopped. That mattered more than the price.', rating: 4 },
    ],
    faq: [
      { question: 'How much will I save?', answer: 'It depends on your roof and your bill. The free survey gives you a figure in writing.' },
      { question: 'What if it is cloudy?', answer: 'Generation drops but does not stop. Systems are sized on annual averages, not best days.' },
      { question: 'How long does it take?', answer: 'A typical home installation takes two days on site, plus around three weeks for approvals.' },
    ],
    galleryTitle: 'Recent work',
    photos: ['solarField', 'solarAerial', 'houseExterior'],
    contactTitle: 'Get a free quote',
    contactSubtitle: 'Send your address and last month’s bill amount for an accurate estimate.',
  },

  {
    id: 'interior',
    label: 'Interior design',
    category: 'business',
    keywords: ['interior', 'design', 'furniture', 'home', 'decor'],
    name: 'Atelier Nine',
    menu: ['Work', 'Studio', 'Process', 'Enquire'],
    cta: 'Start a project',
    secondaryCta: 'See our work',
    headline: 'Rooms that hold up over years',
    slogan: 'Considered interiors for homes that are actually lived in.',
    about:
      '## The studio\n\nWe design homes rather than showrooms. That means storage where it is needed, materials that survive children, and a plan you can build in stages if the budget asks for it.\n\n- Full design and turnkey execution\n- Fixed fees agreed before we start\n- Site supervision through to handover',
    servicesTitle: 'How we work',
    services: [
      { icon: 'PencilRuler', title: 'Design', description: 'Layouts, materials and lighting, drawn in enough detail to be built from.' },
      { icon: 'Hammer', title: 'Execution', description: 'Our own contractors, supervised weekly, to the drawings we gave you.' },
      { icon: 'Sofa', title: 'Styling', description: 'Furniture and finishing once the work is done, if you would like it.' },
    ],
    stats: [
      { value: '140+', label: 'Homes completed' },
      { value: '11', label: 'Years' },
      { value: '12', label: 'Week average project' },
      { value: '100%', label: 'Fixed-fee projects' },
    ],
    reviewsTitle: 'Client words',
    reviews: [
      { name: 'Rohan Kapoor', role: '3 BHK, Bandra', quote: 'They designed around how we live rather than how it would photograph. Two years on it still works.', rating: 5 },
      { name: 'Elena Sousa', role: 'Apartment renovation', quote: 'Fixed fee, fixed timeline, and both held. The site was tidy every single week.', rating: 5 },
      { name: 'Ajay Bhatt', role: 'Villa project', quote: 'We built in two phases across a year. The plan was made for that from the start.', rating: 4 },
    ],
    faq: [
      { question: 'How are your fees structured?', answer: 'A fixed fee agreed after the first site visit, based on area and scope. No percentage of spend.' },
      { question: 'Can you work with my contractor?', answer: 'Yes. We can design only, and supervise your team at agreed intervals.' },
      { question: 'How long does a home take?', answer: 'Around twelve weeks for a full apartment, once drawings are approved and materials are chosen.' },
    ],
    galleryTitle: 'Selected work',
    photos: ['livingRoomModern', 'livingRoomBeige', 'kitchen', 'houseExterior'],
    contactTitle: 'Tell us about your space',
    contactSubtitle: 'Send the size, location and roughly when you would like to start.',
  },

  {
    id: 'construction',
    label: 'Construction',
    category: 'business',
    keywords: ['construction', 'builder', 'contractor', 'civil', 'architecture'],
    name: 'Northgate Builders',
    menu: ['Services', 'Projects', 'About', 'Get a quote'],
    cta: 'Request a quote',
    secondaryCta: 'See projects',
    headline: 'Built right, handed over on time',
    slogan: 'Residential and commercial construction with the schedule in writing.',
    about:
      '## About us\n\nThirty years of building means we quote what a job actually costs and finish when we said we would. Every project gets a site engineer, a weekly report and a shared schedule you can check yourself.\n\n- Written schedule with milestone dates\n- Weekly photo reports\n- Ten-year structural warranty',
    servicesTitle: 'What we build',
    services: [
      { icon: 'Home', title: 'Homes', description: 'Independent houses and villas, from foundation to handover.' },
      { icon: 'Building2', title: 'Commercial', description: 'Offices, showrooms and warehouses built to schedule.' },
      { icon: 'Ruler', title: 'Renovation', description: 'Structural repair and extension work on existing buildings.' },
    ],
    stats: [
      { value: '300+', label: 'Projects delivered' },
      { value: '30', label: 'Years' },
      { value: '10 yr', label: 'Structural warranty' },
      { value: '94%', label: 'Delivered on schedule' },
    ],
    reviewsTitle: 'Client feedback',
    reviews: [
      { name: 'Gopal Krishnan', role: 'Independent house', quote: 'Weekly photos meant I never had to guess. Handover was four days early.', rating: 5 },
      { name: 'Reena Malhotra', role: 'Showroom fit-out', quote: 'They quoted higher than two others and were still the cheapest by the end. No surprises.', rating: 5 },
      { name: 'Peter D’Souza', role: 'House extension', quote: 'Structural work on a fifty-year-old building. Careful, and explained at every stage.', rating: 4 },
    ],
    faq: [
      { question: 'How do you price a project?', answer: 'A detailed item-wise estimate after a site visit and drawings, not a rate per square foot.' },
      { question: 'Do you provide drawings?', answer: 'We work with your architect, or ours if you do not have one.' },
      { question: 'What if the schedule slips?', answer: 'Milestone dates are in the contract, with agreed remedies if we miss them.' },
    ],
    galleryTitle: 'Recent projects',
    photos: ['architectPlans', 'houseExterior', 'officeCorridor'],
    contactTitle: 'Request a quote',
    contactSubtitle: 'Send the location, plot size and what you are planning to build.',
  },

  {
    id: 'realestate',
    label: 'Property',
    category: 'business',
    keywords: ['real estate', 'property', 'rent', 'buy', 'broker'],
    name: 'Keyline Properties',
    menu: ['Listings', 'Buy', 'Rent', 'Contact'],
    cta: 'Talk to an agent',
    secondaryCta: 'Browse listings',
    headline: 'The right place, without the runaround',
    slogan: 'Verified listings, honest advice, and no calls you did not ask for.',
    about:
      '## How we work\n\nEvery listing is visited and photographed by us before it goes up, so what you see is what exists. We show you fewer places, chosen properly.\n\n- Every property personally verified\n- Documentation and registration handled\n- No listing fee for buyers',
    servicesTitle: 'How we help',
    services: [
      { icon: 'Search', title: 'Buying', description: 'A shortlist built around your budget, commute and what matters to you.' },
      { icon: 'KeyRound', title: 'Renting', description: 'Verified rentals with the agreement and paperwork handled.' },
      { icon: 'FileCheck', title: 'Documentation', description: 'Title checks, registration and loan coordination in one place.' },
    ],
    stats: [
      { value: '2,400+', label: 'Deals closed' },
      { value: '16', label: 'Years' },
      { value: '100%', label: 'Listings verified' },
      { value: '11', label: 'Agents' },
    ],
    reviewsTitle: 'Client stories',
    reviews: [
      { name: 'Shweta Rane', role: 'Bought a 2 BHK', quote: 'They showed us four flats instead of forty. The second one is where we live now.', rating: 5 },
      { name: 'Jonathan Fernandes', role: 'Rented an office', quote: 'Every listing matched the photos, which after two months of searching was a relief.', rating: 5 },
      { name: 'Manoj Tiwari', role: 'Sold a property', quote: 'Priced it realistically instead of flattering me. Sold in six weeks.', rating: 4 },
    ],
    faq: [
      { question: 'Do you charge buyers?', answer: 'No listing or search fee. Brokerage is payable only on a completed transaction.' },
      { question: 'Are listings up to date?', answer: 'We re-verify every listing monthly and remove anything no longer available.' },
      { question: 'Can you help with a home loan?', answer: 'We coordinate with three banks and can arrange in-principle approval before you shortlist.' },
    ],
    galleryTitle: 'Featured properties',
    photos: ['houseExterior', 'livingRoomBeige', 'houseKeys', 'livingRoomModern'],
    contactTitle: 'Tell us what you are looking for',
    contactSubtitle: 'Budget, area and when you would like to move.',
  },

  {
    id: 'agency',
    label: 'Agency',
    category: 'business',
    keywords: ['agency', 'marketing', 'branding', 'creative', 'studio'],
    name: 'Northline Studio',
    menu: ['Work', 'Services', 'About', 'Contact'],
    cta: 'Start a project',
    secondaryCta: 'See our work',
    headline: 'Brands that earn attention',
    slogan: 'Strategy, identity and campaigns for businesses with something to prove.',
    about:
      '## About the studio\n\nWe are eleven people who would rather do six projects well than twenty badly. Every engagement starts with a week of research, because good work cannot be guessed at.\n\n- Strategy before design, always\n- Fixed scope and fixed price\n- Direct access to the people doing the work',
    servicesTitle: 'What we do',
    services: [
      { icon: 'Compass', title: 'Brand strategy', description: 'Research, positioning and messaging you can actually act on.' },
      { icon: 'Palette', title: 'Identity', description: 'Logo, type, colour and the guidelines that keep it consistent.' },
      { icon: 'Megaphone', title: 'Campaigns', description: 'Launch work across digital, print and social, measured properly.' },
    ],
    stats: [
      { value: '180+', label: 'Projects' },
      { value: '11', label: 'People' },
      { value: '9', label: 'Years' },
      { value: '70%', label: 'Repeat clients' },
    ],
    reviewsTitle: 'Client words',
    reviews: [
      { name: 'Anand Subramanian', role: 'Founder, retail brand', quote: 'The research week changed what we thought we were selling. Everything after that was easier.', rating: 5 },
      { name: 'Claire Whitmore', role: 'Marketing lead', quote: 'Fixed scope, fixed price, delivered on the date. I have not had that from an agency before.', rating: 5 },
      { name: 'Zaid Hussain', role: 'Co-founder, SaaS', quote: 'We talk to the designers, not an account manager. It shows in the work.', rating: 5 },
    ],
    faq: [
      { question: 'How do you price work?', answer: 'A fixed price per project after a scoping call. No hourly billing and no surprise invoices.' },
      { question: 'How long does a brand project take?', answer: 'Six to ten weeks, depending on how many applications the identity needs.' },
      { question: 'Do you work with small businesses?', answer: 'Often. Smaller scope, same process — we will tell you honestly what fits your budget.' },
    ],
    galleryTitle: 'Inside the studio',
    photos: ['teamMeeting', 'planningWall', 'openPlanOffice'],
    contactTitle: 'Start a project',
    contactSubtitle: 'Tell us what you are working on and roughly when it needs to be live.',
  },

  {
    id: 'software',
    label: 'Software product',
    category: 'technology',
    keywords: ['software', 'saas', 'app', 'product', 'platform'],
    name: 'Ledgerly',
    menu: ['Product', 'Pricing', 'Docs', 'Sign in'],
    cta: 'Start free',
    secondaryCta: 'Book a demo',
    headline: 'Invoicing that closes itself',
    slogan: 'Send, chase and reconcile invoices without leaving one tab.',
    about:
      '## Why Ledgerly\n\nMost small businesses lose days a month to invoices — writing them, chasing them, matching them to bank lines. Ledgerly does the chasing and the matching, and leaves you the deciding.\n\n- Automatic payment reminders\n- Bank reconciliation that learns your patterns\n- Exports your accountant will accept',
    servicesTitle: 'What it does',
    services: [
      { icon: 'Zap', title: 'Send in seconds', description: 'Templates, recurring invoices and payment links that actually get paid.' },
      { icon: 'Bell', title: 'Chases for you', description: 'Polite reminders on a schedule you set, stopping the moment money arrives.' },
      { icon: 'ShieldCheck', title: 'Reconciles itself', description: 'Bank lines matched to invoices automatically, with anything unclear flagged.' },
    ],
    stats: [
      { value: '12,000+', label: 'Businesses' },
      { value: '₹840cr', label: 'Invoiced' },
      { value: '18 days', label: 'Faster payment' },
      { value: '99.98%', label: 'Uptime' },
    ],
    reviewsTitle: 'What customers say',
    reviews: [
      { name: 'Pooja Nanda', role: 'Founder, design studio', quote: 'Getting paid went from a weekly chore to something I stopped thinking about.', rating: 5 },
      { name: 'Ben Alvarez', role: 'Operations, logistics', quote: 'Reconciliation used to take two days a month. It now takes about twenty minutes.', rating: 5 },
      { name: 'Sana Kapadia', role: 'Freelance consultant', quote: 'The reminders are polite enough that no client has ever mentioned them. They just pay.', rating: 5 },
    ],
    faq: [
      { question: 'Is there a free plan?', answer: 'Yes — up to ten invoices a month, with every feature included and no card required.' },
      { question: 'Does it work with my bank?', answer: 'We connect to most major banks. If yours is missing, statement import works the same way.' },
      { question: 'Can my accountant access it?', answer: 'Yes, with a free read-only login and one-click exports in the formats they expect.' },
    ],
    galleryTitle: 'The team',
    photos: ['openPlanOffice', 'planningWall', 'teamMeeting'],
    contactTitle: 'Talk to us',
    contactSubtitle: 'Questions about migrating, pricing or anything else.',
  },

  {
    id: 'itservices',
    label: 'IT services',
    category: 'technology',
    keywords: ['it', 'support', 'network', 'managed', 'cloud'],
    name: 'Blackpine Systems',
    menu: ['Services', 'Support', 'About', 'Contact'],
    cta: 'Get in touch',
    secondaryCta: 'See services',
    headline: 'IT that stays out of your way',
    slogan: 'Managed support, cloud and security for businesses without an IT team.',
    about:
      '## About us\n\nWe look after the technology for around ninety small and mid-sized businesses. Fixed monthly fee, unlimited support calls, and a response time we put in the contract.\n\n- Response within one hour, guaranteed\n- Fixed monthly fee per user\n- Monthly report on what we fixed',
    servicesTitle: 'What we handle',
    services: [
      { icon: 'Headphones', title: 'Helpdesk', description: 'Unlimited support for your staff, by phone, email or remote session.' },
      { icon: 'Cloud', title: 'Cloud and email', description: 'Migration, backup and day-to-day management of your workspace.' },
      { icon: 'Lock', title: 'Security', description: 'Endpoint protection, patching and a recovery plan that has been tested.' },
    ],
    stats: [
      { value: '90+', label: 'Businesses supported' },
      { value: '<1h', label: 'Response time' },
      { value: '4,000+', label: 'Tickets a year' },
      { value: '13', label: 'Years' },
    ],
    reviewsTitle: 'Client feedback',
    reviews: [
      { name: 'Vivek Ranganathan', role: 'Director, manufacturing', quote: 'We used to call someone when things broke. Now things mostly do not break.', rating: 5 },
      { name: 'Hannah Cole', role: 'Office manager', quote: 'The monthly report is the first IT document I have actually read. Plain English.', rating: 5 },
      { name: 'Faisal Ahmed', role: 'Partner, accountancy', quote: 'Migrated forty mailboxes over a weekend. Monday morning nobody noticed anything.', rating: 4 },
    ],
    faq: [
      { question: 'How is it priced?', answer: 'A fixed monthly fee per user covering unlimited support. No hourly charges.' },
      { question: 'Do you work on site?', answer: 'Most issues are solved remotely. On-site visits are included for anything that is not.' },
      { question: 'What are your hours?', answer: 'Support runs 8 AM to 8 PM on weekdays, with an on-call line for genuine emergencies.' },
    ],
    galleryTitle: 'Our work',
    photos: ['officeCorridor', 'openPlanOffice', 'handshake'],
    contactTitle: 'Get in touch',
    contactSubtitle: 'Tell us how many people you have and what is causing trouble.',
  },

  {
    id: 'consulting',
    label: 'Consulting',
    category: 'business',
    keywords: ['consulting', 'advisory', 'finance', 'legal', 'professional'],
    name: 'Ashworth Advisory',
    menu: ['Services', 'Sectors', 'Team', 'Contact'],
    cta: 'Arrange a consultation',
    secondaryCta: 'Our services',
    headline: 'Advice you can act on Monday',
    slogan: 'Financial and operational consulting for growing businesses.',
    about:
      '## About the practice\n\nWe work with owner-run businesses between ten and two hundred people — large enough to have real problems, small enough that the owner still feels every one of them.\n\n- Engagements scoped in writing\n- Senior people on every project\n- Recommendations with a costed plan',
    servicesTitle: 'How we help',
    services: [
      { icon: 'TrendingUp', title: 'Growth planning', description: 'Where the next revenue comes from, and what it will cost to get it.' },
      { icon: 'Calculator', title: 'Financial review', description: 'Margins, cash flow and pricing examined line by line.' },
      { icon: 'Settings2', title: 'Operations', description: 'Process and structure work for businesses that have outgrown their systems.' },
    ],
    stats: [
      { value: '240+', label: 'Engagements' },
      { value: '19', label: 'Years' },
      { value: '8', label: 'Sectors' },
      { value: '65%', label: 'Clients return' },
    ],
    reviewsTitle: 'Client experience',
    reviews: [
      { name: 'Lakshmi Narayan', role: 'MD, distribution', quote: 'The pricing review paid for the whole engagement inside a quarter.', rating: 5 },
      { name: 'Robert Sinclair', role: 'Owner, manufacturing', quote: 'They gave us a plan with numbers attached, not a slide deck of principles.', rating: 5 },
      { name: 'Divya Prasad', role: 'CFO, services', quote: 'Senior people did the work, which is not what we got from the larger firm before.', rating: 4 },
    ],
    faq: [
      { question: 'How long is a typical engagement?', answer: 'Most run four to eight weeks, with a written scope and fee agreed before we begin.' },
      { question: 'Do you work with small businesses?', answer: 'Yes, from around ten employees. Below that, an advisory call is usually better value.' },
      { question: 'What happens after the report?', answer: 'We stay available through implementation, usually as a monthly review for six months.' },
    ],
    galleryTitle: 'The practice',
    photos: ['handshake', 'teamMeeting', 'workshopTable'],
    contactTitle: 'Arrange a consultation',
    contactSubtitle: 'A short call first, at no cost, to see whether we are the right fit.',
  },

  {
    id: 'cleaning',
    label: 'Cleaning service',
    category: 'business',
    keywords: ['cleaning', 'housekeeping', 'sanitising', 'maid', 'service'],
    name: 'BrightHouse Cleaning',
    menu: ['Services', 'Pricing', 'Areas', 'Book'],
    cta: 'Book a clean',
    secondaryCta: 'See prices',
    headline: 'Come home to a clean house',
    slogan: 'Trained, background-checked cleaners. Fixed prices, no contracts.',
    about:
      '## About us\n\nEvery cleaner is trained, insured and background-checked, and you get the same person each visit wherever possible. Prices are fixed by home size, not by how long it takes.\n\n- Same cleaner each visit\n- Fixed price by home size\n- Re-clean free if anything is missed',
    servicesTitle: 'What we clean',
    services: [
      { icon: 'Sparkles', title: 'Regular cleaning', description: 'Weekly or fortnightly, on a checklist you set once.' },
      { icon: 'Boxes', title: 'Deep clean', description: 'Kitchens, bathrooms, appliances and skirting, twice a year.' },
      { icon: 'Truck', title: 'Move in and out', description: 'A full clean before handover, done to a landlord checklist.' },
    ],
    stats: [
      { value: '3,000+', label: 'Homes cleaned' },
      { value: '100%', label: 'Staff background-checked' },
      { value: '48h', label: 'Booking notice' },
      { value: '4.8', label: 'Average rating' },
    ],
    reviewsTitle: 'Customer feedback',
    reviews: [
      { name: 'Nandini Rao', role: 'Fortnightly customer', quote: 'Same person every time, which means I no longer explain anything. She just knows.', rating: 5 },
      { name: 'Oliver Grant', role: 'Move-out clean', quote: 'Deposit returned in full. The landlord specifically mentioned the kitchen.', rating: 5 },
      { name: 'Sarita Bhalla', role: 'Weekly customer', quote: 'Fixed price is why I switched. No more arguments about hours.', rating: 5 },
    ],
    faq: [
      { question: 'Do I need to be home?', answer: 'Not at all. Most customers leave a key or a code once they have met their cleaner.' },
      { question: 'Do you bring supplies?', answer: 'Yes, everything is included. We can use your own products if you prefer.' },
      { question: 'What if something is missed?', answer: 'Tell us within twenty-four hours and we return and re-clean it at no charge.' },
    ],
    galleryTitle: 'Our work',
    photos: ['livingRoomBeige', 'kitchen', 'livingRoomModern'],
    contactTitle: 'Book a clean',
    contactSubtitle: 'Send your home size, area and the day that suits you.',
  },
]

export function packById(id: string): ContentPack {
  return contentPacks.find((pack) => pack.id === id) ?? contentPacks[0]
}
