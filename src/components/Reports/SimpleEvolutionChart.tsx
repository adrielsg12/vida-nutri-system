import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RegistroConsulta {
  id: string;
  peso: number | null;
  altura: number | null;
  percentual_gordura: number | null;
  massa_muscular: number | null;
  created_at: string;
}

interface SimpleEvolutionChartProps {
  registros: RegistroConsulta[];
  metrica: 'percentual_gordura' | 'peso' | 'massa_muscular';
  titulo: string;
  unidade: string;
  cor?: string;
}

export const SimpleEvolutionChart: React.FC<SimpleEvolutionChartProps> = ({
  registros,
  metrica,
  titulo,
  unidade,
  cor = '#3b82f6'
}) => {
  const dadosGrafico = registros
    .filter(registro => registro[metrica] !== null)
    .map(registro => ({
      data: format(new Date(registro.created_at), 'dd/MM/yyyy', { locale: ptBR }),
      valor: registro[metrica] as number,
      dataCompleta: new Date(registro.created_at)
    }))
    .sort((a, b) => a.dataCompleta.getTime() - b.dataCompleta.getTime());

  if (dadosGrafico.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Não há dados suficientes para gerar o gráfico de {titulo.toLowerCase()}.</p>
      </div>
    );
  }

  const maxValue = Math.max(...dadosGrafico.map(d => d.valor));
  const minValue = Math.min(...dadosGrafico.map(d => d.valor));
  const range = maxValue - minValue || 1;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-center">{titulo}</h3>
      
      <div className="space-y-3">
        {dadosGrafico.map((item, index) => {
          const heightPercent = ((item.valor - minValue) / range) * 100;
          const isLast = index === dadosGrafico.length - 1;
          const isFirst = index === 0;
          
          let tendencia = '';
          if (index > 0) {
            const anterior = dadosGrafico[index - 1].valor;
            if (item.valor > anterior) tendencia = 'up';
            else if (item.valor < anterior) tendencia = 'down';
            else tendencia = 'stable';
          }
          
          return (
            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="text-sm font-medium min-w-[80px]">
                {item.data}
              </div>
              
              <div className="flex-1 flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-4 relative">
                  <div 
                    className="h-4 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.max(heightPercent, 5)}%`,
                      backgroundColor: cor
                    }}
                  />
                </div>
                
                <div className="text-lg font-semibold min-w-[80px]">
                  {item.valor.toFixed(1)} {unidade}
                </div>
                
                {index > 0 && (
                  <div className="flex items-center gap-1">
                    {tendencia === 'up' && (
                      <span className="text-green-600 text-sm">↗ +{(item.valor - dadosGrafico[index - 1].valor).toFixed(1)}</span>
                    )}
                    {tendencia === 'down' && (
                      <span className="text-red-600 text-sm">↘ {(item.valor - dadosGrafico[index - 1].valor).toFixed(1)}</span>
                    )}
                    {tendencia === 'stable' && (
                      <span className="text-gray-600 text-sm">→ 0.0</span>
                    )}
                  </div>
                )}
                
                {isLast && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    Atual
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>
          Variação total: <span className="font-medium">
            {dadosGrafico.length > 1 
              ? `${(dadosGrafico[dadosGrafico.length - 1].valor - dadosGrafico[0].valor).toFixed(1)} ${unidade}`
              : 'N/A'
            }
          </span>
        </p>
      </div>
    </div>
  );
};