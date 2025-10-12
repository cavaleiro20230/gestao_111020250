import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../../App';
import type { Personnel } from '../../../types';

interface OrgChartNodeProps {
    person: Personnel;
    allPersonnel: Personnel[];
    level: number;
}

const OrgChartNode: React.FC<OrgChartNodeProps> = ({ person, allPersonnel, level }) => {
    const directReports = allPersonnel.filter(p => p.managerId === person.id);

    return (
        <div className="flex flex-col items-center">
            {/* Person Card */}
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-md border-2 border-teal-500 w-48 text-center">
                <div className="font-bold text-sm">{person.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{person.position}</div>
            </div>

            {/* Connecting Line and Children */}
            {directReports.length > 0 && (
                <>
                    {/* Vertical line down */}
                    <div className="w-px h-8 bg-slate-300 dark:bg-slate-600"></div>
                    {/* Horizontal line */}
                    <div className="h-px bg-slate-300 dark:bg-slate-600" style={{ width: `${directReports.length > 1 ? (directReports.length * 208 - 16) : 0}px`}}></div>
                    
                    <div className="flex justify-center gap-4">
                        {directReports.map(report => (
                            <div key={report.id} className="flex flex-col items-center relative">
                                {/* Vertical line up */}
                                <div className="absolute -top-8 w-px h-8 bg-slate-300 dark:bg-slate-600"></div>
                                <OrgChartNode person={report} allPersonnel={allPersonnel} level={level + 1} />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};


const OrgChartTab: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { personnel, users } = context;

    // Combine users and personnel for the chart, assuming users are also part of the hierarchy
    const allPeople: Personnel[] = [
        ...personnel,
        // FIX: Explicitly type the return value of map() as Personnel to fix type incompatibility.
        ...users.filter(u => u.type === 'internal' && !personnel.some(p => p.email === u.email)).map((u): Personnel => ({
            id: u.id,
            name: u.name,
            email: u.email,
            position: u.position,
            linkType: 'CLT',
            costPerHour: 0,
            admissionDate: '',
            managerId: personnel.find(p => p.position === 'Diretor' || p.position.includes('Gerente'))?.id // Simplification
        }))
    ];

    const rootPersonnel = useMemo(() => {
        return allPeople.filter(p => !p.managerId || !allPeople.some(p2 => p2.id === p.managerId));
    }, [allPeople]);

    return (
        <div className="p-4 overflow-x-auto bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            {rootPersonnel.length > 0 ? (
                <div className="flex justify-center">
                     {rootPersonnel.map(person => (
                        <OrgChartNode key={person.id} person={person} allPersonnel={allPeople} level={0} />
                     ))}
                </div>
            ) : (
                <p className="text-center text-slate-500">Nenhuma hierarquia definida. Edite a equipe para adicionar gestores.</p>
            )}
        </div>
    );
};

export default OrgChartTab;