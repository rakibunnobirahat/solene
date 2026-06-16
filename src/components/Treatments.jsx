import React from 'react';
import { Link } from 'react-router-dom';
import { getTreatment } from '../api/allTreatments.js'

const API_BASE_URL = import.meta.env.VITE_API_URL;

const treatmentData = await getTreatment(API_BASE_URL, 'treatments')
const treatmentsSolid = treatmentData.data

const treatmentsImage = [
    {
        id: 1,
        url: 'https://queenbeauty.sg/img-vCDN/QzlrM0Q0VVJjOSt2NEhYbjhmbjUwSDNTMnU1VU1EMHExMUxybFBFbTFqVWsxZVUyTUQ3aUYzZkVPNWR3dDhZZkh5dUVZWVVsaHNlQ0VtYkw1eFU1TSswPQ==.orig.webp',
    },
    {
        id: 2,
        url: 'https://i.makeup.uk/3/3q/3qh4pjknwjpc.jpg',
    },
    {
        id: 3,
        url: 'https://skinapeel.com/wp-content/uploads/2023/02/Ultrasound-Facial-1024x683.jpeg',
    },
    {
        id: 4,
        url: 'https://images.lifestyleasia.com/wp-content/uploads/sites/3/2021/12/31065749/pexels-anna-shvets-5069401-min-copy-scaled.jpg',
    }
];

/* Reusable grid card — hover to reveal description */
const TreatmentSolidCard = ({ treatment }) => {
    const [expanded, setExpanded] = React.useState(false);

    return (
        <div
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
            className="rounded-2xl w-100 h-100 bg-accent flex flex-col justify-center items-center transition-all duration-300"
        >
            <div className="p-4 md:p-5 flex flex-col gap-4 justify-center items-center">
                <span className="font-icon text-4xl">
                    {treatment.icon}
                </span>
                <h3 className="font-serif text-primary text-xl md:text-2xl font-semibold text-center">
                    {treatment.name.split(' ')[0]}<br />{treatment.name.split(' ')[1]}
                </h3>
                <div
                    className="overflow-hidden flex flex-col justify-center items-center gap-4 text-center transition-all duration-400 ease-in-out"
                    style={{
                        maxHeight: expanded ? '120px' : '0px',
                        opacity: expanded ? 1 : 0,
                    }}
                >
                    <p className="font-sans text-primary text-xs md:text-sm font-normal text-center w-[80%] mx-auto">
                        {treatment.description}
                    </p>
                    <button className='bg-primary text-white rounded-full cursor-pointer px-6 py-2 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20 transition-colors'>Learn More</button>
                </div>
            </div>
        </div>
    );
};

const TreatmentImageCard = ({ treatment }) => (
    <div className={`overflow-hidden rounded-2xl w-100 h-100`}>
        <img
            src={treatment.url}
            className="w-full h-full object-cover transition-transform duration-700"
        />
    </div>
);

const Treatments = () => {
    return (
        <section className="py-12 md:py-20 bg-bg-cream" id="treatments">
            <div className="max-w-350 mx-auto px-6 lg:px-12">

                {/* Header — left heading + right description side-by-side */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
                    <div className="lg:max-w-[55%]">
                        <h2 className="font-serif text-2xl md:text-3xl lg:text-[2.5rem] font-thin text-text-dark leading-snug">
                            Where Care Meets{' '}
                            <span className="italic font-light text-primary">Innovation,</span>
                            <br />
                            and Every Detail Reflects a
                            <br />
                            Promise to You
                        </h2>
                    </div>
                    <div className="lg:max-w-85">
                        <p className="text-text-muted text-sm font-light leading-relaxed mb-4">
                            Our treatments are crafted by board-certified experts
                            using the latest innovations in aesthetic medicine.
                            Each procedure is designed with precision and care.
                        </p>
                        <Link
                            to="/treatments"
                            className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:text-primary-hover transition-colors group"
                        >
                            Explore All Treatments
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* Card grid — 3 columns,3 rows */}
                <div className="flex flex-col gap-4 md:gap-5 w-full justify-center items-center">
                    <div className="flex flex-row gap-4 md:gap-5 w-full justify-between items-center">
                        {/* Row 1, Col 1 */}
                        <TreatmentSolidCard treatment={treatmentsSolid[0]} />
                        {/* Row 1, Col 2*/}
                        <TreatmentImageCard treatment={treatmentsImage[0]} />
                        {/* Row 1, Col 3 */}
                        <TreatmentSolidCard treatment={treatmentsSolid[1]} />
                    </div>
                    <div className="flex flex-row gap-4 md:gap-5 w-full justify-between items-center">
                        {/* Row 2, Col 1 */}
                        <TreatmentImageCard treatment={treatmentsImage[1]} />
                        {/* Row 2, Col 2 */}
                        <TreatmentSolidCard treatment={treatmentsSolid[2]} />
                        {/* Row 2, Col 3 */}
                        <TreatmentImageCard treatment={treatmentsImage[2]} />
                    </div>
                    <div className="flex flex-row gap-4 md:gap-5 w-full justify-between items-center">
                        {/* Row 3, Col 1 */}
                        <TreatmentSolidCard treatment={treatmentsSolid[3]} />
                        {/* Row 3, Col 2 */}
                        <TreatmentImageCard treatment={treatmentsImage[3]} />
                        {/* Row 3, Col 3 */}
                        <TreatmentSolidCard treatment={treatmentsSolid[4]} />
                    </div>
                </div>

            </div>
        </section >
    );
};

export default Treatments;
