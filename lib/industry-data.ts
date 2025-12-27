// Industry sector data configuration for Daily Event Insurance

export interface IndustrySector {
  slug: string
  title: string
  shortTitle: string
  metaTitle: string
  metaDescription: string
  heroTitle: string
  heroSubtitle: string
  icon: string
  categoryId: string // Links to IndustryCategory
  benefits: {
    title: string
    description: string
    icon: string
  }[]
  howItWorks: {
    title: string
    description: string
  }[]
  faqs: {
    question: string
    answer: string
  }[]
  stats: {
    label: string
    value: string
  }[]
  testimonial?: {
    quote: string
    author: string
    role: string
    company: string
  }
}

export const industrySectors: Record<string, IndustrySector> = {
  "race-directors": {
    slug: "race-directors",
    title: "Running Event Insurance",
    shortTitle: "Race Directors",
    metaTitle: "Race Director Event Insurance | Same Day Coverage for Running Events",
    metaDescription: "Protect your running events with same-day insurance coverage. Offer instant participant protection, reduce liability, and earn revenue on every race registration.",
    heroTitle: "Event Insurance Built for Race Directors",
    heroSubtitle: "Protect participants, reduce your liability exposure, and create a new revenue stream with every race registration.",
    icon: "Activity",
    categoryId: "race-events",
    benefits: [
      {
        title: "Participant Protection",
        description: "Offer instant coverage at registration for 5Ks, 10Ks, half marathons, and full marathons. Give your runners peace of mind before race day.",
        icon: "Shield"
      },
      {
        title: "Revenue Per Registration",
        description: "Earn 20-30% commission on every insurance policy sold. Turn each race entry into multiple revenue streams.",
        icon: "DollarSign"
      },
      {
        title: "Reduced Liability Risk",
        description: "Lower your exposure when participants carry their own coverage. Demonstrate due diligence to sponsors and venues.",
        icon: "TrendingDown"
      },
      {
        title: "Seamless Integration",
        description: "Works with RunSignup, Race Roster, Chronotrack, and all major registration platforms. 5-minute setup.",
        icon: "Zap"
      }
    ],
    howItWorks: [
      {
        title: "Add to Registration",
        description: "Integrate Daily Event Insurance as an optional add-on during race registration. Participants opt-in with one click."
      },
      {
        title: "Instant Coverage",
        description: "Runners receive immediate confirmation and digital proof of coverage via email. Active from registration through race completion."
      },
      {
        title: "You Earn Commission",
        description: "Automatic commission payout on every policy sold. No management, no overhead, just passive revenue."
      }
    ],
    faqs: [
      {
        question: "What types of running events can offer this insurance?",
        answer: "All running events including 5Ks, 10Ks, half marathons, full marathons, ultra races, trail runs, obstacle races, and fun runs. Coverage adapts to your event type and distance."
      },
      {
        question: "How much commission do race directors earn?",
        answer: "Race directors typically earn 20-30% commission on every insurance policy sold. For a race with 500 participants and a 40% insurance take rate, that's $500-$750 in additional revenue per event."
      },
      {
        question: "Does this replace my event liability insurance?",
        answer: "No, participant insurance is complementary to your event liability coverage. It protects individual participants for medical costs and trip cancellation, while your event insurance covers organizational liability."
      },
      {
        question: "Which registration platforms do you integrate with?",
        answer: "We integrate with RunSignup, Race Roster, Chronotrack, Active.com, Let's Do This, Eventbrite, and can work with custom registration systems via API."
      },
      {
        question: "How quickly can I add this to my next race?",
        answer: "Most race directors are live within 24 hours. Setup takes 5-10 minutes, and we handle all technical integration with your registration platform."
      }
    ],
    stats: [
      { label: "Avg. Commission Per Race", value: "$620" },
      { label: "Participant Take Rate", value: "38%" },
      { label: "Setup Time", value: "5 min" }
    ],
    testimonial: {
      quote: "We added Daily Event Insurance to our half marathon series and earned an extra $2,400 across three events. Participants love having the option, and it's completely hands-off for us.",
      author: "Marcus Rodriguez",
      role: "Race Director",
      company: "Pacific Northwest Trail Series"
    }
  },

  "cycling-events": {
    slug: "cycling-events",
    title: "Cycling Event Insurance",
    shortTitle: "Bike Races",
    metaTitle: "Cycling Event Insurance | Same Day Coverage for Bike Races & Gran Fondos",
    metaDescription: "Instant participant insurance for road races, criteriums, gran fondos, and gravel events. Protect your cyclists and earn commission on every registration.",
    heroTitle: "Insurance for Cycling Event Organizers",
    heroSubtitle: "Protect your riders with same-day coverage for road races, criteriums, gran fondos, and gravel events while earning revenue.",
    icon: "Bike",
    categoryId: "race-events",
    benefits: [
      {
        title: "Multi-Discipline Coverage",
        description: "Road racing, criteriums, time trials, gran fondos, gravel races, and cyclocross events. Comprehensive protection for all cycling disciplines.",
        icon: "Shield"
      },
      {
        title: "High-Risk Coverage",
        description: "Cycling events carry inherent risk. Give your participants professional-grade coverage that addresses crashes, injuries, and equipment damage.",
        icon: "AlertTriangle"
      },
      {
        title: "Event Series Revenue",
        description: "For race series and recurring events, insurance becomes a significant recurring revenue stream. Earn commission on every event in your calendar.",
        icon: "TrendingUp"
      },
      {
        title: "Sponsor Confidence",
        description: "Demonstrate professionalism to sponsors and venues by offering participant insurance. Shows you take safety and risk management seriously.",
        icon: "Award"
      }
    ],
    howItWorks: [
      {
        title: "Registration Integration",
        description: "Add insurance as an optional line item during event registration. Works with BikeReg, USA Cycling, and all major platforms."
      },
      {
        title: "Rider Protection",
        description: "Participants get instant coverage for medical expenses, emergency transportation, and trip cancellation. Active from registration through race completion."
      },
      {
        title: "Passive Income",
        description: "Earn 20-30% commission automatically. For a 200-rider criterium with 45% take rate, that's $225-$340 per event."
      }
    ],
    faqs: [
      {
        question: "What cycling events can offer this insurance?",
        answer: "All competitive and recreational cycling events: road races, criteriums, circuit races, time trials, gran fondos, gravel races, cyclocross, stage races, and charity rides."
      },
      {
        question: "Does coverage include equipment damage?",
        answer: "Our standard participant coverage focuses on medical protection and trip cancellation. Equipment coverage can be added as an optional upgrade depending on your event type."
      },
      {
        question: "How does this work for USA Cycling licensed events?",
        answer: "This participant insurance is complementary to USA Cycling's event permit requirements. It provides additional protection for riders beyond the basic event insurance."
      },
      {
        question: "What about international participants in gran fondos?",
        answer: "Coverage extends to international participants riding in U.S.-based events. We can also support events in select international markets."
      },
      {
        question: "Can I offer this for a race series?",
        answer: "Absolutely. Race series see the highest commission totals. We can create series packages and season pass insurance options for your regular participants."
      }
    ],
    stats: [
      { label: "Avg. Revenue Per Event", value: "$480" },
      { label: "Cyclist Take Rate", value: "42%" },
      { label: "Platform Integration", value: "< 1 day" }
    ]
  },

  "triathlons": {
    slug: "triathlons",
    title: "Triathlon Event Insurance",
    shortTitle: "Multi-Sport Events",
    metaTitle: "Triathlon Insurance | Multi-Sport Event Coverage for Race Directors",
    metaDescription: "Same-day insurance for triathlons, duathlons, and multi-sport events. Protect participants across swim, bike, and run with integrated coverage.",
    heroTitle: "Multi-Sport Event Insurance",
    heroSubtitle: "Comprehensive coverage for triathlons, duathlons, aquathlons, and adventure races. Protect participants across all disciplines.",
    icon: "Waves",
    categoryId: "race-events",
    benefits: [
      {
        title: "Multi-Discipline Protection",
        description: "Coverage spans swimming, cycling, and running segments. One policy protects participants through all event phases including transitions.",
        icon: "Shield"
      },
      {
        title: "Open Water Coverage",
        description: "Specialized protection for open water swim starts. Critical coverage that addresses the highest-risk segment of triathlon events.",
        icon: "Droplet"
      },
      {
        title: "Higher Policy Values",
        description: "Triathletes expect comprehensive coverage given the event investment. Premium policies mean higher commission potential per participant.",
        icon: "DollarSign"
      },
      {
        title: "USAT Integration",
        description: "Seamless integration with USA Triathlon sanctioned events and registration platforms including Athlinks and TriRegistration.",
        icon: "Zap"
      }
    ],
    howItWorks: [
      {
        title: "Add to Registration Flow",
        description: "Insurance offered during race registration with clear explanation of coverage across all disciplines. One-click opt-in."
      },
      {
        title: "Comprehensive Protection",
        description: "Participants covered from race start through finish line. Includes medical, emergency evacuation, trip cancellation, and race abandonment."
      },
      {
        title: "Commission on Every Sale",
        description: "Earn 25-30% on each policy. For a 300-athlete Ironman 70.3 with 50% take rate, that's $1,125-$1,350 per event."
      }
    ],
    faqs: [
      {
        question: "Does coverage include the open water swim?",
        answer: "Yes, full coverage includes the swim segment with specialized open water protection. This is one of the primary benefits athletes look for in triathlon insurance."
      },
      {
        question: "What distances are covered?",
        answer: "All triathlon distances: sprint, Olympic, half Ironman (70.3), full Ironman, and ultra-distance events. Also covers duathlons, aquathlons, and other multi-sport formats."
      },
      {
        question: "How does this work with USAT-sanctioned events?",
        answer: "Participant insurance is complementary to your USAT event sanction and required liability coverage. It provides additional protection for individual athletes."
      },
      {
        question: "Can athletes get coverage for just a race series?",
        answer: "Yes, we can create series passes for athletes competing in multiple events. This increases athlete value and creates recurring commission revenue."
      },
      {
        question: "What about relay team coverage?",
        answer: "Relay participants can each purchase individual coverage, or we can create team policies depending on your event structure and relay format."
      }
    ],
    stats: [
      { label: "Avg. Per Event Revenue", value: "$1,150" },
      { label: "Athlete Take Rate", value: "48%" },
      { label: "Policy Premium Avg.", value: "$15" }
    ]
  },

  "obstacle-courses": {
    slug: "obstacle-courses",
    title: "Obstacle Course Race Insurance",
    shortTitle: "OCR Events",
    metaTitle: "OCR Insurance | Obstacle Course Race Coverage for Event Organizers",
    metaDescription: "Same-day insurance for Spartan races, Tough Mudder events, and obstacle course competitions. Protect participants on high-risk obstacles while earning revenue.",
    heroTitle: "OCR Event Insurance",
    heroSubtitle: "Specialized coverage for obstacle course races, mud runs, and extreme endurance events. Protection built for high-risk activities.",
    icon: "Mountain",
    categoryId: "race-events",
    benefits: [
      {
        title: "High-Risk Activity Coverage",
        description: "Specialized protection for walls, rope climbs, monkey bars, water obstacles, electricity, fire, and extreme challenges that standard insurance won't cover.",
        icon: "AlertTriangle"
      },
      {
        title: "Venue Requirement Compliance",
        description: "Many obstacle course venues now require participant insurance. Daily Event Insurance satisfies venue requirements while generating revenue.",
        icon: "CheckCircle"
      },
      {
        title: "Premium Policy Pricing",
        description: "OCR events command higher insurance premiums due to risk level. Higher premiums mean higher commission potential for race organizers.",
        icon: "TrendingUp"
      },
      {
        title: "Waiver Enhancement",
        description: "Participant insurance strengthens your waiver process and demonstrates comprehensive risk management to stakeholders.",
        icon: "FileText"
      }
    ],
    howItWorks: [
      {
        title: "Registration Add-On",
        description: "Offer insurance during registration with clear explanation of OCR-specific coverage. Participants understand the value given event risk."
      },
      {
        title: "Obstacle-Specific Protection",
        description: "Coverage includes medical expenses, ambulance transport, hospital treatment, and emergency evacuation from remote obstacle locations."
      },
      {
        title: "Substantial Commission",
        description: "Earn 25-35% on premium policies. For a 500-participant OCR with 55% take rate, that's $1,375-$1,925 per event."
      }
    ],
    faqs: [
      {
        question: "Does coverage include all obstacle types?",
        answer: "Yes, coverage extends to all standard OCR obstacles including walls, cargo nets, monkey bars, tire drags, water crossings, mud pits, and specialty obstacles like fire jumps and electrical wires."
      },
      {
        question: "What if a venue requires participant insurance?",
        answer: "Daily Event Insurance provides certificates of coverage that satisfy venue requirements. We can coordinate directly with venue management for proof of participant coverage."
      },
      {
        question: "How does pricing compare to standard race insurance?",
        answer: "OCR insurance is typically $10-20 per participant due to elevated risk, compared to $5-10 for road races. Higher premiums mean higher commission for race organizers."
      },
      {
        question: "Can we offer this for kids' obstacle races?",
        answer: "Yes, we offer specialized coverage for youth OCR events with appropriate risk assessment and pricing for participants under 18."
      },
      {
        question: "What about multi-day adventure races?",
        answer: "Multi-day events are covered. We can structure policies for 24-hour challenges, weekend events, and multi-day adventure races with overnight camping."
      }
    ],
    stats: [
      { label: "Event Revenue Avg.", value: "$1,640" },
      { label: "OCR Take Rate", value: "53%" },
      { label: "Premium Per Policy", value: "$14" }
    ]
  },

  "marathons": {
    slug: "marathons",
    title: "Marathon Event Insurance",
    shortTitle: "Marathons & Fun Runs",
    metaTitle: "Marathon Insurance | Same Day Coverage for 26.2 Mile Events & Fun Runs",
    metaDescription: "Protect your marathon, half marathon, and fun run participants with instant insurance coverage. Reduce liability and create new revenue from race registrations.",
    heroTitle: "Marathon & Fun Run Insurance",
    heroSubtitle: "Comprehensive participant protection for full marathons, half marathons, 10Ks, 5Ks, and charity fun runs.",
    icon: "Award",
    categoryId: "race-events",
    benefits: [
      {
        title: "Distance Event Protection",
        description: "Specialized coverage for endurance events with elevated medical risk. Protection for heat illness, dehydration, cardiac events, and overuse injuries.",
        icon: "Heart"
      },
      {
        title: "Charity Run Partner Value",
        description: "Add value for charity partners and fundraising participants. Insurance becomes an additional benefit for major fundraisers and VIP runners.",
        icon: "Users"
      },
      {
        title: "International Runner Coverage",
        description: "Covers international participants traveling to your event. Critical for destination marathons and major city events attracting global runners.",
        icon: "Globe"
      },
      {
        title: "Travel Protection Add-On",
        description: "Optional trip cancellation coverage for destination marathons. Protects runners' investment in travel, hotels, and race fees.",
        icon: "Plane"
      }
    ],
    howItWorks: [
      {
        title: "Registration Integration",
        description: "Add insurance at checkout with clear value proposition. Many runners actively seek protection for their marathon investment."
      },
      {
        title: "Race Day Protection",
        description: "Coverage active from gun start through finish line. Includes medical expenses, emergency transport, and post-race treatment."
      },
      {
        title: "Steady Revenue Stream",
        description: "For annual marathons, insurance revenue becomes a predictable line item. Larger events generate $3,000-$8,000 per year."
      }
    ],
    faqs: [
      {
        question: "What makes marathon insurance different from other race insurance?",
        answer: "Marathon insurance includes higher medical limits ($50,000+) and addresses endurance-specific risks like heat stroke, cardiac events, and severe dehydration that are more common in 26.2-mile events."
      },
      {
        question: "Can runners add trip cancellation coverage?",
        answer: "Yes, for destination marathons we offer trip cancellation coverage that protects runners' investment in race fees, hotels, and travel if they can't participate due to injury or illness."
      },
      {
        question: "How much revenue can a marathon generate from insurance?",
        answer: "A marathon with 2,000 finishers and 40% insurance take rate generates $4,000-$6,000 in commission revenue. Larger marathons with 10,000+ runners can exceed $20,000."
      },
      {
        question: "Do virtual marathons qualify for coverage?",
        answer: "Yes, virtual and hybrid marathon formats are covered. Runners can purchase protection for their virtual race completion regardless of location."
      },
      {
        question: "What about relay marathon teams?",
        answer: "Relay team members can each purchase individual coverage, or we can create team policies with appropriate pricing based on distance per runner."
      }
    ],
    stats: [
      { label: "Large Event Revenue", value: "$5,200" },
      { label: "Marathon Take Rate", value: "41%" },
      { label: "Avg. Policy Value", value: "$12" }
    ]
  },

  "corporate-wellness": {
    slug: "corporate-wellness",
    title: "Corporate Wellness Event Insurance",
    shortTitle: "Corporate Wellness",
    metaTitle: "Corporate Wellness Insurance | Coverage for Company Fitness Events",
    metaDescription: "Instant insurance for corporate 5Ks, company fitness challenges, and wellness programs. Protect employees and create revenue from corporate event partnerships.",
    heroTitle: "Corporate Wellness Event Insurance",
    heroSubtitle: "Protection for company 5Ks, wellness challenges, charity runs, and corporate fitness events. Serve the growing B2B wellness market.",
    icon: "Building",
    categoryId: "race-events",
    benefits: [
      {
        title: "B2B Event Opportunities",
        description: "Corporate wellness events represent high-volume, recurring business. Companies host quarterly or annual events with guaranteed participation.",
        icon: "Briefcase"
      },
      {
        title: "Employee Benefit Positioning",
        description: "Companies appreciate offering insurance as an employee benefit. Positions your event as a premium corporate wellness solution.",
        icon: "Award"
      },
      {
        title: "Bulk Policy Pricing",
        description: "Volume discounts for corporate groups make insurance accessible. Companies often cover the cost as part of event sponsorship.",
        icon: "Users"
      },
      {
        title: "Annual Contract Revenue",
        description: "Corporate clients often commit to annual event series. Creates predictable, recurring commission revenue throughout the year.",
        icon: "Calendar"
      }
    ],
    howItWorks: [
      {
        title: "Corporate Sales Integration",
        description: "Position insurance as a value-add when pitching corporate event packages. Differentiates your offering from competitors."
      },
      {
        title: "Employee Coverage",
        description: "Company provides insurance for all participating employees. Demonstrates investment in employee safety and wellness."
      },
      {
        title: "Recurring Commission",
        description: "Earn commission on corporate events throughout the year. A single corporate client can generate $2,000-$5,000 annually."
      }
    ],
    faqs: [
      {
        question: "How do companies typically purchase insurance for employees?",
        answer: "Most companies add insurance as a line item to the event package and cover the cost. Some offer it as an optional add-on during employee registration."
      },
      {
        question: "What types of corporate events does this cover?",
        answer: "Company 5Ks, corporate fitness challenges, charity team runs, employee wellness races, executive retreats with fitness components, and team building athletic events."
      },
      {
        question: "Can we offer volume discounts for large companies?",
        answer: "Yes, bulk pricing is available for companies registering 50+ employees. Volume discounts make insurance accessible while still generating significant commission."
      },
      {
        question: "How does this help win corporate event contracts?",
        answer: "Many companies now expect participant insurance as part of professional event management. Offering it proactively demonstrates sophistication and risk management."
      },
      {
        question: "Do we need special licensing to sell to corporations?",
        answer: "No, you're offering the insurance through Daily Event Insurance's platform. We handle all licensing and regulatory requirements."
      }
    ],
    stats: [
      { label: "Annual Client Value", value: "$3,200" },
      { label: "Corporate Take Rate", value: "78%" },
      { label: "Avg. Event Size", value: "180" }
    ]
  },

  "schools-universities": {
    slug: "schools-universities",
    title: "School & University Athletics Insurance",
    shortTitle: "Schools & Universities",
    metaTitle: "School Athletics Insurance | Coverage for University Running Events",
    metaDescription: "Same-day insurance for college fun runs, alumni races, homecoming 5Ks, and university athletic events. Protect students and generate revenue for athletic programs.",
    heroTitle: "School & University Event Insurance",
    heroSubtitle: "Coverage for college fun runs, alumni races, student recreation events, and university athletic fundraisers.",
    icon: "GraduationCap",
    categoryId: "race-events",
    benefits: [
      {
        title: "Student Safety Priority",
        description: "Universities prioritize student safety and risk management. Participant insurance demonstrates institutional commitment to protecting students.",
        icon: "Shield"
      },
      {
        title: "Alumni Engagement Revenue",
        description: "Homecoming runs and alumni races generate strong insurance take rates. Alumni are willing to pay for comprehensive coverage.",
        icon: "Users"
      },
      {
        title: "Athletics Department Revenue",
        description: "Provides additional revenue stream for athletic programs facing budget pressures. Passive income with no administrative overhead.",
        icon: "DollarSign"
      },
      {
        title: "Greek Life Events",
        description: "Fraternity and sorority charity runs, Greek Week competitions, and philanthropic athletic events all benefit from participant protection.",
        icon: "Award"
      }
    ],
    howItWorks: [
      {
        title: "Campus Event Integration",
        description: "Add insurance to student recreation events, intramural races, and campus-wide challenges. Simple integration with campus registration systems."
      },
      {
        title: "Student & Alumni Coverage",
        description: "Protect current students, alumni, faculty, staff, and community participants. Comprehensive coverage for all participant categories."
      },
      {
        title: "Department Revenue",
        description: "Commission flows to athletic department, student recreation, or event organizing body. Supports program funding and student opportunities."
      }
    ],
    faqs: [
      {
        question: "Can we offer insurance for student recreation events?",
        answer: "Yes, all campus athletic events qualify including fun runs, charity races, Greek life competitions, club sports events, and student organization fundraisers."
      },
      {
        question: "How does this work with university insurance requirements?",
        answer: "Participant insurance is supplemental to university liability coverage. It provides additional protection for individual students beyond institutional policies."
      },
      {
        question: "What about liability for student-organized events?",
        answer: "Student organizations can offer participant insurance for their events. It demonstrates professionalism and helps secure university approval for athletic fundraisers."
      },
      {
        question: "Can alumni associations use this for reunions?",
        answer: "Absolutely. Alumni weekend 5Ks and homecoming runs see strong insurance uptake. Alumni appreciate the option given they're often traveling to campus."
      },
      {
        question: "How do we handle parent permission for student events?",
        answer: "For participants under 18, we can integrate parental consent into the registration and insurance purchase flow, ensuring compliance with university policies."
      }
    ],
    stats: [
      { label: "Alumni Event Revenue", value: "$840" },
      { label: "Student Take Rate", value: "35%" },
      { label: "Greek Event Take Rate", value: "52%" }
    ]
  },

  "gyms-fitness": {
    slug: "gyms-fitness",
    title: "Gym & Fitness Center Event Insurance",
    shortTitle: "Gyms & Fitness Centers",
    metaTitle: "Gym Event Insurance | Same Day Coverage for Fitness Challenges",
    metaDescription: "Instant insurance for fitness challenges, CrossFit competitions, boot camps, and gym member events. Protect participants and earn revenue on every challenge.",
    heroTitle: "Fitness Center Event Insurance",
    heroSubtitle: "Comprehensive coverage for fitness challenges, CrossFit competitions, gym tournaments, and member appreciation events.",
    icon: "Dumbbell",
    categoryId: "fitness-gyms",
    benefits: [
      {
        title: "Challenge Event Revenue",
        description: "Fitness challenges and transformation contests drive member engagement and retention. Add insurance as a premium option to boost revenue per participant.",
        icon: "TrendingUp"
      },
      {
        title: "High-Intensity Coverage",
        description: "CrossFit WODs, HIIT classes, powerlifting meets, and intense training sessions carry elevated injury risk. Specialized coverage addresses liability concerns.",
        icon: "Flame"
      },
      {
        title: "Member Value Addition",
        description: "Offering participant insurance differentiates your gym from competitors. Shows commitment to member safety beyond standard facility liability coverage.",
        icon: "Award"
      },
      {
        title: "Recurring Challenge Revenue",
        description: "Monthly or quarterly challenges become predictable commission opportunities. Turn your challenge calendar into a consistent revenue stream.",
        icon: "Calendar"
      }
    ],
    howItWorks: [
      {
        title: "Challenge Registration",
        description: "Add insurance during sign-up for transformation challenges, partner competitions, team events, and fitness tournaments. Seamless integration with MindBody, Zen Planner, and gym management software."
      },
      {
        title: "Participant Protection",
        description: "Members get coverage for training injuries, competition accidents, and emergency medical expenses during the challenge period. Active from day one through final weigh-in."
      },
      {
        title: "Commission Per Event",
        description: "Earn 25-30% on every policy sold. For a 60-person transformation challenge with 45% take rate, that's $202-$243 in passive revenue per challenge."
      }
    ],
    faqs: [
      {
        question: "What types of fitness events can offer this insurance?",
        answer: "All gym events including transformation challenges, CrossFit competitions, powerlifting meets, partner WOD competitions, boot camp challenges, nutrition challenges with workouts, and member appreciation athletic events."
      },
      {
        question: "Does coverage extend beyond competition day?",
        answer: "Yes, for multi-week challenges, coverage spans the entire challenge period from start date through final event. Protects participants during all training sessions and competition components."
      },
      {
        question: "How does this work with gym liability insurance?",
        answer: "Participant insurance is complementary to your facility liability coverage. It protects individual members for medical costs while your gym insurance covers facility and organizational liability."
      },
      {
        question: "Can we offer insurance for personal training sessions?",
        answer: "Currently our focus is on group events and challenges. For ongoing personal training, members should consider individual fitness insurance policies rather than event-specific coverage."
      },
      {
        question: "What about virtual fitness challenges?",
        answer: "Yes, virtual and hybrid fitness challenges qualify. Members completing workouts at home or any location can purchase protection for challenge-related injuries."
      }
    ],
    stats: [
      { label: "Per Challenge Revenue", value: "$225" },
      { label: "Fitness Take Rate", value: "44%" },
      { label: "Avg. Challenge Size", value: "48" }
    ],
    testimonial: {
      quote: "We run quarterly transformation challenges and started offering Daily Event Insurance six months ago. It's generated over $800 in commission while giving our members added peace of mind during intense training.",
      author: "Sarah Mitchell",
      role: "Owner",
      company: "Elevate Fitness CrossFit"
    }
  },

  "rock-climbing": {
    slug: "rock-climbing",
    title: "Rock Climbing Facility Insurance",
    shortTitle: "Climbing Gyms",
    metaTitle: "Climbing Gym Insurance | Coverage for Bouldering & Rope Events",
    metaDescription: "Same-day insurance for climbing competitions, bouldering challenges, and facility events. Protect climbers on high-risk activities while generating revenue.",
    heroTitle: "Climbing Facility Event Insurance",
    heroSubtitle: "Specialized coverage for climbing competitions, bouldering leagues, youth climbing events, and facility challenges.",
    icon: "Mountain",
    categoryId: "fitness-gyms",
    benefits: [
      {
        title: "High-Risk Activity Protection",
        description: "Lead climbing, bouldering, speed climbing, and auto-belay usage carry inherent fall risk. Comprehensive coverage addresses the unique liability of vertical sports.",
        icon: "AlertTriangle"
      },
      {
        title: "Competition Event Revenue",
        description: "Climbing comps, bouldering leagues, and route-setting challenges attract serious athletes willing to invest in proper protection. Premium pricing reflects activity risk.",
        icon: "Trophy"
      },
      {
        title: "Youth Climber Coverage",
        description: "Parents expect robust safety measures for youth climbing teams and junior competitions. Participant insurance demonstrates professional risk management.",
        icon: "Users"
      },
      {
        title: "Outdoor Trip Protection",
        description: "Facility-organized outdoor climbing trips and guided sessions benefit from extended coverage. Protects participants at remote crag locations.",
        icon: "Map"
      }
    ],
    howItWorks: [
      {
        title: "Event Registration",
        description: "Offer insurance during competition registration, league sign-up, or facility challenge enrollment. Clear explanation of climbing-specific coverage increases uptake."
      },
      {
        title: "Comprehensive Fall Coverage",
        description: "Protection includes fall injuries, belaying accidents, bouldering impacts, equipment failures, and emergency medical transport from climbing facilities or outdoor locations."
      },
      {
        title: "Premium Commission",
        description: "Earn 30-35% on climbing event policies due to elevated risk category. A 40-climber competition with 60% take rate generates $336-$392 in revenue."
      }
    ],
    faqs: [
      {
        question: "Does coverage include both indoor and outdoor climbing?",
        answer: "Yes, coverage extends to indoor facility events and facility-organized outdoor trips. Both gym climbing and outdoor crag sessions are protected under the same policy."
      },
      {
        question: "What climbing disciplines are covered?",
        answer: "All climbing types including bouldering, top-rope, lead climbing, speed climbing, auto-belay routes, and outdoor sport climbing or traditional climbing on facility-organized trips."
      },
      {
        question: "How does pricing reflect climbing risk levels?",
        answer: "Climbing insurance typically ranges $14-24 per participant depending on event type and duration. Higher risk activities like outdoor lead climbing command premium pricing and higher commission."
      },
      {
        question: "Can youth climbing teams purchase coverage?",
        answer: "Absolutely. Youth team competitions and junior league events are covered with parental consent integration. Many gyms require insurance for youth competitive teams."
      },
      {
        question: "What about liability for equipment failure?",
        answer: "Participant insurance covers medical expenses resulting from equipment failures. It complements but doesn't replace your facility's equipment liability insurance and safety inspection protocols."
      }
    ],
    stats: [
      { label: "Competition Revenue", value: "$365" },
      { label: "Climber Take Rate", value: "58%" },
      { label: "Premium Per Policy", value: "$18" }
    ],
    testimonial: {
      quote: "Our monthly bouldering competitions have become a significant revenue source beyond entry fees. Daily Event Insurance adds $300-400 per month in commission while giving our climbers professional-grade protection.",
      author: "Alex Chen",
      role: "General Manager",
      company: "Summit Climbing Collective"
    }
  },

  "ski-resorts": {
    slug: "ski-resorts",
    title: "Ski Resort Event Insurance",
    shortTitle: "Ski Resorts & Snow Sports",
    metaTitle: "Ski Resort Insurance | Coverage for Races & Snow Sport Events",
    metaDescription: "Instant insurance for ski races, snowboard competitions, and mountain events. Protect participants in high-risk snow sports while earning commission revenue.",
    heroTitle: "Ski Resort Event Insurance",
    heroSubtitle: "Comprehensive coverage for ski races, snowboard competitions, terrain park events, and winter sport challenges.",
    icon: "Snowflake",
    categoryId: "activity-based",
    benefits: [
      {
        title: "Winter Sport Risk Coverage",
        description: "Skiing, snowboarding, and mountain events carry substantial injury risk. Specialized coverage addresses high-speed collisions, lift accidents, and mountain emergency evacuations.",
        icon: "AlertCircle"
      },
      {
        title: "Race Series Revenue",
        description: "NASTAR races, boardercross competitions, and resort race series run throughout the season. Insurance creates recurring commission revenue across your event calendar.",
        icon: "TrendingUp"
      },
      {
        title: "Terrain Park Events",
        description: "Freestyle competitions, rail jams, and big air events attract participants seeking comprehensive coverage. Premium policies reflect extreme sport risk levels.",
        icon: "Sparkles"
      },
      {
        title: "International Visitor Coverage",
        description: "Destination ski resorts attract international visitors who may lack U.S. medical coverage. Participant insurance fills critical gaps for foreign competitors.",
        icon: "Globe"
      }
    ],
    howItWorks: [
      {
        title: "Event Registration",
        description: "Add insurance to race registration, competition sign-up, or event series enrollment. Integration with resort POS and registration systems makes offering seamless."
      },
      {
        title: "Mountain Emergency Protection",
        description: "Coverage includes on-mountain injuries, ski patrol response, emergency sledding, helicopter evacuation, and hospital treatment. Active from event start through award ceremony."
      },
      {
        title: "Seasonal Commission Revenue",
        description: "Winter season events generate cumulative commission. A resort running 20 weekend races at $400 each generates $8,000 in annual insurance revenue."
      }
    ],
    faqs: [
      {
        question: "What types of ski resort events can offer insurance?",
        answer: "All winter events including ski races (GS, slalom, downhill), snowboard competitions, terrain park contests, rail jams, NASTAR races, adaptive skiing events, and mountain festivals with athletic components."
      },
      {
        question: "Does coverage include helicopter evacuation costs?",
        answer: "Yes, emergency medical evacuation is included up to policy limits. Mountain helicopter rescues can cost $3,000-$10,000, making this coverage extremely valuable for participants."
      },
      {
        question: "How does this work with ski patrol services?",
        answer: "Participant insurance covers the cost of ski patrol response, emergency sledding, and medical treatment. It complements resort operations and protects participants from unexpected medical bills."
      },
      {
        question: "Can resorts offer insurance for terrain park sessions?",
        answer: "Currently our focus is on organized competitions and events. General terrain park usage would fall under individual season-long policies rather than event-specific coverage."
      },
      {
        question: "What about multi-day competition series?",
        answer: "Multi-day events are fully covered. Weekend competition series, week-long training camps, and multi-stage competitions receive appropriate extended coverage periods."
      }
    ],
    stats: [
      { label: "Race Series Revenue", value: "$8,200" },
      { label: "Winter Sport Take Rate", value: "51%" },
      { label: "Avg. Policy Premium", value: "$22" }
    ],
    testimonial: {
      quote: "We added participant insurance to our NASTAR race program and terrain park competitions. It's generated over $6,000 this season while addressing a major concern for international racers who lack U.S. coverage.",
      author: "Tom Harrison",
      role: "Events Director",
      company: "Alpine Peak Resort"
    }
  },

  "skydiving": {
    slug: "skydiving",
    title: "Skydiving & Aerial Sports Insurance",
    shortTitle: "Skydiving & Aerial Sports",
    metaTitle: "Skydiving Event Insurance | Coverage for Aerial Sport Competitions",
    metaDescription: "Same-day insurance for skydiving competitions, BASE jumping events, and aerial sport challenges. Specialized coverage for extreme air sports with premium revenue.",
    heroTitle: "Skydiving & Aerial Sports Event Insurance",
    heroSubtitle: "Specialized coverage for skydiving competitions, formation flying events, wingsuit challenges, and aerial sport exhibitions.",
    icon: "Plane",
    categoryId: "activity-based",
    benefits: [
      {
        title: "Extreme Sport Specialization",
        description: "Skydiving, BASE jumping, and aerial sports represent the highest risk category. Our specialized coverage addresses parachute malfunctions, landing injuries, and mid-air incidents.",
        icon: "AlertOctagon"
      },
      {
        title: "Premium Policy Revenue",
        description: "Extreme sport insurance commands highest premiums in the industry due to risk profile. Higher policy values translate to substantial commission per participant.",
        icon: "DollarSign"
      },
      {
        title: "Competition Event Focus",
        description: "Formation skydiving, canopy piloting, wingsuit competitions, and accuracy challenges attract serious athletes who understand insurance value and actively seek coverage.",
        icon: "Target"
      },
      {
        title: "International Event Coverage",
        description: "Major skydiving competitions draw international participants. Coverage extends to foreign competitors participating in U.S.-based aerial sport events.",
        icon: "Globe"
      }
    ],
    howItWorks: [
      {
        title: "Competition Registration",
        description: "Offer insurance during event sign-up with clear explanation of aerial sport coverage. Most participants understand risk profile and actively seek comprehensive protection."
      },
      {
        title: "Comprehensive Aerial Coverage",
        description: "Protection includes parachute malfunctions, landing injuries, mid-air collisions, equipment failures, emergency medical transport, and specialized trauma care."
      },
      {
        title: "Maximum Commission Potential",
        description: "Earn 35-40% on premium skydiving policies. A 30-person formation flying competition with 70% take rate generates $735-$840 in event revenue."
      }
    ],
    faqs: [
      {
        question: "What aerial sports does this coverage include?",
        answer: "Skydiving (all disciplines), formation flying, canopy piloting, wingsuit flying, BASE jumping events, paragliding competitions, paramotoring, and other aerial sports conducted as organized events."
      },
      {
        question: "How much does skydiving event insurance cost?",
        answer: "Skydiving insurance typically ranges $35-60 per participant for competition events, reflecting the extreme risk category. Premium pricing enables substantial commission revenue."
      },
      {
        question: "Does coverage include experienced and novice jumpers?",
        answer: "Coverage is designed for licensed skydivers participating in competitions. Tandem jumps and student training would fall under different insurance categories specific to drop zone operations."
      },
      {
        question: "What about multi-day skydiving festivals?",
        answer: "Multi-day competitions and week-long skydiving events receive extended coverage periods. Policy premiums adjust for event duration and total number of jumps planned."
      },
      {
        question: "How does this work with USPA requirements?",
        answer: "Participant insurance is complementary to USPA event requirements and drop zone liability coverage. It provides additional protection for individual competitors beyond organizational insurance."
      }
    ],
    stats: [
      { label: "Event Commission Avg.", value: "$785" },
      { label: "Skydiver Take Rate", value: "68%" },
      { label: "Premium Per Policy", value: "$45" }
    ],
    testimonial: {
      quote: "Our annual formation skydiving competition now offers Daily Event Insurance. Nearly 70% of competitors purchase coverage, generating $1,500 in commission while addressing their biggest concern about medical costs.",
      author: "Jennifer Larson",
      role: "Competition Director",
      company: "Vertical Dreams Skydiving Center"
    }
  },

  "equipment-rentals": {
    slug: "equipment-rentals",
    title: "Equipment Rental Event Insurance",
    shortTitle: "Equipment Rentals",
    metaTitle: "Equipment Rental Insurance | Coverage for Activity Rental Events",
    metaDescription: "Instant insurance for bike rentals, kayak outfitters, gear rental events, and adventure equipment. Protect customers and reduce liability while earning revenue.",
    heroTitle: "Equipment Rental Event Insurance",
    heroSubtitle: "Coverage for bike rental tours, kayak outfitters, adventure gear rentals, and equipment-based recreational events.",
    icon: "Package",
    categoryId: "activity-based",
    benefits: [
      {
        title: "Customer Liability Reduction",
        description: "When renters carry their own insurance, your equipment damage liability decreases. Participant coverage supplements your rental agreement and reduces dispute risk.",
        icon: "ShieldCheck"
      },
      {
        title: "Rental Upsell Revenue",
        description: "Add insurance at point of rental for $3-8 per customer. On 50 daily rentals at 40% take rate, that's $180-$320 additional weekly revenue with zero overhead.",
        icon: "TrendingUp"
      },
      {
        title: "Event & Tour Coverage",
        description: "Guided bike tours, group kayak outings, multi-day adventure rentals, and equipment-based events all benefit from participant protection during usage period.",
        icon: "Map"
      },
      {
        title: "Damage Waiver Alternative",
        description: "Offer insurance as an alternative to equipment damage waivers. Provides broader coverage while creating commission revenue instead of just reducing liability.",
        icon: "RefreshCw"
      }
    ],
    howItWorks: [
      {
        title: "Point of Rental Integration",
        description: "Add insurance option during rental checkout process. Integrates with rental management software including FareHarbor, Peek Pro, and Checkfront."
      },
      {
        title: "Usage Period Protection",
        description: "Renters receive coverage for personal injury during equipment usage, medical expenses from accidents, and protection during the full rental period."
      },
      {
        title: "Daily Commission Revenue",
        description: "Earn 25-30% on every insurance add-on. High-volume rental operations can generate $400-$1,200 monthly in passive commission revenue."
      }
    ],
    faqs: [
      {
        question: "What types of rental businesses can offer this insurance?",
        answer: "Bike rentals, kayak and paddleboard outfitters, ski and snowboard rentals, climbing gear rentals, camping equipment, adventure tour operators, and any recreational equipment rental operation."
      },
      {
        question: "Does coverage include equipment damage protection?",
        answer: "Primary focus is participant medical protection during equipment usage. Equipment damage coverage can be added as an optional upgrade depending on rental type and value."
      },
      {
        question: "How does this differ from standard damage waivers?",
        answer: "Traditional damage waivers only reduce renter liability for equipment damage. Participant insurance provides comprehensive medical coverage plus optional equipment protection, creating more customer value."
      },
      {
        question: "Can we offer insurance for multi-day rentals?",
        answer: "Yes, coverage extends for the full rental period whether that's hourly, daily, or multi-day. Pricing adjusts based on rental duration and equipment type."
      },
      {
        question: "What about guided tour operations?",
        answer: "Guided bike tours, kayak excursions, and adventure outings are excellent use cases. Participants appreciate having their own coverage beyond the tour operator's liability insurance."
      }
    ],
    stats: [
      { label: "Monthly Revenue Avg.", value: "$840" },
      { label: "Rental Take Rate", value: "41%" },
      { label: "Per Transaction Fee", value: "$6" }
    ],
    testimonial: {
      quote: "We run a bike rental and tour business on the waterfront. Adding Daily Event Insurance to our checkout process was seamless and now generates $600-800 monthly in commission. Customers love having the option.",
      author: "David Park",
      role: "Owner",
      company: "Coastal Bike & Kayak Rentals"
    }
  },

  "water-sports": {
    slug: "water-sports",
    title: "Water Sports & Adventure Event Insurance",
    shortTitle: "Water Sports & Adventure",
    metaTitle: "Water Sports Insurance | Coverage for Kayaking, SUP & Adventure Events",
    metaDescription: "Same-day insurance for kayak races, SUP competitions, open water swims, and water sport events. Protect participants and earn revenue from aquatic activities.",
    heroTitle: "Water Sports Event Insurance",
    heroSubtitle: "Comprehensive coverage for kayak races, SUP competitions, open water swimming, surf contests, and aquatic adventure events.",
    icon: "Waves",
    categoryId: "activity-based",
    benefits: [
      {
        title: "Open Water Risk Coverage",
        description: "Open water swimming, ocean paddling, river kayaking, and surf competitions carry unique drowning and water-related risks. Specialized coverage addresses aquatic emergency scenarios.",
        icon: "AlertTriangle"
      },
      {
        title: "Multi-Sport Event Revenue",
        description: "Paddleboard races, kayak competitions, swim challenges, and beach festivals often feature multiple water sport categories. Insurance revenue compounds across event disciplines.",
        icon: "Trophy"
      },
      {
        title: "Safety Boat Coordination",
        description: "Participant insurance complements safety boat operations and lifeguard coverage. Demonstrates comprehensive risk management to permits and venue authorities.",
        icon: "Anchor"
      },
      {
        title: "Destination Event Appeal",
        description: "Beach races, island paddle events, and destination water sport competitions attract participants willing to invest in comprehensive protection for travel and participation.",
        icon: "MapPin"
      }
    ],
    howItWorks: [
      {
        title: "Registration Integration",
        description: "Add insurance during event registration for paddleboard races, kayak competitions, open water swims, and surf contests. Clear water safety messaging increases uptake."
      },
      {
        title: "Aquatic Emergency Coverage",
        description: "Protection includes water rescue response, emergency watercraft evacuation, drowning incidents, marine life injuries, and specialized water sport medical treatment."
      },
      {
        title: "Event Commission",
        description: "Earn 25-35% on water sport policies. A 150-participant SUP race with 48% take rate generates $450-$630 in commission revenue per event."
      }
    ],
    faqs: [
      {
        question: "What water sports events can offer this insurance?",
        answer: "Kayak and canoe races, stand-up paddleboard competitions, open water swimming events, surf contests, dragon boat races, rowing regattas, water skiing, wakeboarding competitions, and aquatic adventure challenges."
      },
      {
        question: "Does coverage include open ocean events?",
        answer: "Yes, open ocean paddleboard races, ocean swimming, and coastal water sport events are covered. Coverage addresses unique open water risks including currents, marine life, and distance from shore."
      },
      {
        question: "How does this work with Coast Guard permits?",
        answer: "Participant insurance complements Coast Guard event requirements and marine event permits. It demonstrates participant safety measures and comprehensive risk management to authorities."
      },
      {
        question: "Can we offer insurance for river kayaking events?",
        answer: "Absolutely. Whitewater races, river kayak competitions, and moving water events are covered with appropriate risk assessment. Coverage addresses river-specific hazards and remote location access."
      },
      {
        question: "What about multi-day paddling expeditions?",
        answer: "Multi-day water sport events and expeditions receive extended coverage periods. Island-hopping paddleboard races and weekend kayak camping trips qualify for event insurance."
      }
    ],
    stats: [
      { label: "Per Event Revenue", value: "$540" },
      { label: "Water Sport Take Rate", value: "47%" },
      { label: "Avg. Policy Value", value: "$16" }
    ],
    testimonial: {
      quote: "Our ocean paddleboard race series offers Daily Event Insurance and it's become a significant secondary revenue source. Participants appreciate comprehensive water safety coverage and we've earned over $2,000 this season.",
      author: "Nicole Stevens",
      role: "Race Director",
      company: "Pacific Coast SUP Series"
    }
  },

  "medispas": {
    slug: "medispas",
    title: "MediSpa Event Insurance",
    shortTitle: "MediSpas & Aesthetics",
    metaTitle: "MediSpa Event Insurance | Coverage for Aesthetic Center Events",
    metaDescription: "Instant insurance for MediSpa open houses, aesthetic treatment events, and wellness demonstrations. Protect attendees and generate revenue from promotional events.",
    heroTitle: "MediSpa Event Insurance",
    heroSubtitle: "Coverage for aesthetic treatment demonstrations, MediSpa open houses, injectable events, and wellness center promotional activities.",
    icon: "Sparkles",
    categoryId: "aesthetic-wellness",
    benefits: [
      {
        title: "Event Liability Protection",
        description: "Open houses, treatment demonstrations, and promotional events expose your practice to liability beyond standard malpractice coverage. Event insurance addresses promotional activity risks.",
        icon: "Shield"
      },
      {
        title: "Client Confidence Building",
        description: "Offering event insurance demonstrates professionalism and risk management sophistication. Shows prospective clients you prioritize safety at all touchpoints.",
        icon: "Award"
      },
      {
        title: "VIP Event Revenue",
        description: "Injectable parties, laser treatment demos, and aesthetic wellness events attract high-value clients. Insurance creates additional revenue from premium promotional events.",
        icon: "Crown"
      },
      {
        title: "Multi-Location Coverage",
        description: "For MediSpa chains running simultaneous promotional events across locations, centralized insurance creates operational efficiency and consistent brand standards.",
        icon: "Building2"
      }
    ],
    howItWorks: [
      {
        title: "Event Registration",
        description: "Offer insurance during RSVP for open houses, treatment demonstrations, wellness seminars, and promotional events. Integrates with Calendly, Eventbrite, and booking systems."
      },
      {
        title: "Attendee Protection",
        description: "Participants receive coverage for demonstration-related incidents, allergic reactions during samples, slip-and-fall accidents, and medical emergencies at promotional events."
      },
      {
        title: "Premium Event Commission",
        description: "Earn 25-30% on event policies. A VIP injectable event with 40 attendees and 50% take rate generates $200-$240 in commission revenue per event."
      }
    ],
    faqs: [
      {
        question: "What types of MediSpa events can offer insurance?",
        answer: "Open houses, injectable demonstrations, laser treatment showcases, wellness seminars, product launch parties, VIP aesthetic events, beauty and wellness expos, and promotional treatment events."
      },
      {
        question: "Does this replace our malpractice insurance?",
        answer: "No, event insurance is complementary to professional malpractice coverage. It addresses promotional event risks while your malpractice insurance covers actual treatment provision and clinical decisions."
      },
      {
        question: "Can we offer insurance for actual treatment events?",
        answer: "Event insurance works best for promotional activities, demonstrations, and open houses. Actual treatment provision should fall under your professional liability and malpractice coverage."
      },
      {
        question: "How does this help with event marketing?",
        answer: "Mentioning event insurance in promotional materials demonstrates professionalism and risk management. It can differentiate your events from competitors and attract safety-conscious clients."
      },
      {
        question: "What about multi-location MediSpa events?",
        answer: "We can create centralized event insurance programs for MediSpa chains running promotional events across multiple locations. Streamlines insurance management and ensures brand consistency."
      }
    ],
    stats: [
      { label: "VIP Event Revenue", value: "$225" },
      { label: "Attendee Take Rate", value: "48%" },
      { label: "Avg. Event Size", value: "35" }
    ],
    testimonial: {
      quote: "We host quarterly injectable events and started offering Daily Event Insurance. It adds $150-200 per event in commission while reinforcing our commitment to client safety. Attendees appreciate the professional touch.",
      author: "Dr. Amanda Peterson",
      role: "Medical Director",
      company: "Luxe Aesthetic & Wellness"
    }
  },

  "wellness-recovery": {
    slug: "wellness-recovery",
    title: "Wellness & Recovery Center Event Insurance",
    shortTitle: "Wellness & Recovery Centers",
    metaTitle: "Wellness Center Insurance | Coverage for Recovery & Retreat Events",
    metaDescription: "Same-day insurance for wellness retreats, recovery workshops, and therapeutic events. Protect participants in holistic health experiences while earning revenue.",
    heroTitle: "Wellness & Recovery Event Insurance",
    heroSubtitle: "Comprehensive coverage for wellness retreats, recovery workshops, therapeutic movement classes, and holistic health events.",
    icon: "Heart",
    categoryId: "aesthetic-wellness",
    benefits: [
      {
        title: "Holistic Activity Coverage",
        description: "Yoga retreats, sound healing workshops, breathwork sessions, cold plunge experiences, and therapeutic movement classes all carry liability exposure. Specialized coverage addresses holistic wellness risks.",
        icon: "Flower2"
      },
      {
        title: "Multi-Day Retreat Revenue",
        description: "Wellness retreats and immersive programs command premium pricing. Insurance on 3-day retreats with $500+ registration fees creates substantial commission opportunities.",
        icon: "Calendar"
      },
      {
        title: "Participant Safety Priority",
        description: "Wellness clients prioritize safety and professional standards. Offering comprehensive insurance demonstrates commitment to participant wellbeing and elevates brand perception.",
        icon: "ShieldCheck"
      },
      {
        title: "Experiential Activity Protection",
        description: "Cold plunge therapy, infrared saunas, cryotherapy sessions, and emerging wellness modalities benefit from clear insurance coverage and participant protection.",
        icon: "Thermometer"
      }
    ],
    howItWorks: [
      {
        title: "Retreat Registration",
        description: "Add insurance during booking for wellness retreats, therapeutic workshops, recovery programs, and holistic health events. Seamless integration with MindBody, WellnessLiving, and retreat booking platforms."
      },
      {
        title: "Comprehensive Wellness Coverage",
        description: "Participants receive protection for activity-related injuries, therapeutic session incidents, wellness modality reactions, and medical emergencies during program participation."
      },
      {
        title: "Retreat Commission Revenue",
        description: "Earn 25-30% on wellness event policies. A 20-person weekend retreat with 55% take rate at $25 per policy generates $137-$165 in commission per event."
      }
    ],
    faqs: [
      {
        question: "What types of wellness events can offer insurance?",
        answer: "Yoga retreats, meditation intensives, breathwork workshops, sound healing sessions, therapeutic movement classes, cold plunge experiences, wellness weekends, recovery program workshops, and holistic health seminars."
      },
      {
        question: "Does coverage include alternative healing modalities?",
        answer: "Yes, coverage extends to various wellness practices including energy healing demonstrations, sound therapy, breathwork, cold exposure therapy, and other holistic modalities when offered as event components."
      },
      {
        question: "How does this work for multi-day retreats?",
        answer: "Multi-day wellness retreats receive extended coverage for the full program duration. Weekend retreats, week-long intensives, and multi-day immersive programs all qualify for event insurance."
      },
      {
        question: "Can recovery centers offer insurance for workshops?",
        answer: "Absolutely. Recovery workshops, therapeutic movement classes, wellness education seminars, and group healing sessions all benefit from participant insurance coverage."
      },
      {
        question: "What about destination wellness retreats?",
        answer: "Destination retreats are covered including travel to retreat location and program participation. We can add trip cancellation coverage for participants investing in destination wellness experiences."
      }
    ],
    stats: [
      { label: "Retreat Revenue Avg.", value: "$155" },
      { label: "Wellness Take Rate", value: "54%" },
      { label: "Avg. Policy Premium", value: "$22" }
    ],
    testimonial: {
      quote: "Our quarterly wellness retreats now include Daily Event Insurance as a registration option. Over 60% of participants opt in, generating $400-500 per retreat while addressing their primary concern about safety during therapeutic activities.",
      author: "Maya Johnson",
      role: "Founder",
      company: "Restore Wellness & Recovery"
    }
  }
}

export const industrySectorsList = Object.values(industrySectors)

// Helper function to get sector by slug
export function getSectorBySlug(slug: string): IndustrySector | undefined {
  return industrySectors[slug]
}

// Generate all valid sector slugs for static generation
export function getAllSectorSlugs(): string[] {
  return Object.keys(industrySectors)
}
