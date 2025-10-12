// FIX: Create ProjectRiskAnalysis.tsx to resolve module not found error.
import React from 'react';
import type { Project } from '../types';
import ProjectAIAssistant from './ProjectAIAssistant';

interface ProjectRiskAnalysisProps {
    project: Project;
}

const ProjectRiskAnalysis: React.FC<ProjectRiskAnalysisProps> = ({ project }) => {
    // This component provides risk analysis by wrapping the more general ProjectAIAssistant.
    return (
        <ProjectAIAssistant project={project} />
    );
};

export default ProjectRiskAnalysis;