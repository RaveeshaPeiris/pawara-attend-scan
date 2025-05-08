
import React from "react";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ClassCardProps {
  id: string;
  name: string;
  grade: number;
  studentCount: number;
}

const ClassCard: React.FC<ClassCardProps> = ({ id, name, grade, studentCount }) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all p-4"
      onClick={() => navigate(`/scan/${id}`)}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">Grade: {grade}</p>
          <p className="text-sm text-muted-foreground">{studentCount} students</p>
        </div>
        <ArrowRight className="text-primary" />
      </div>
    </Card>
  );
};

export default ClassCard;
