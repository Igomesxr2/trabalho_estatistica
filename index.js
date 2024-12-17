const careerButtons = document.querySelectorAll('.career');
const statButtons = document.querySelectorAll('.stat-btn');
let selectedCareers = [];
let salaryChart = null;

const careerSalaryData = {
    "Desenvolvedor Front-end": [4500, 4700, 5000, 5300, 5100, 5200, 4900, 5500],
    "Desenvolvedor Back-end": [5000, 5300, 5500, 5700, 5900, 5800, 6000, 6200],
    "Engenheiro de Dados": [7000, 7300, 7500, 7800, 7700, 8000, 8200, 8500],
    "Desenvolvedor Mobile": [5500, 5700, 5900, 6100, 5900, 6000, 6200, 6300],
    "Data Scientist": [8000, 8300, 8600, 8800, 8900, 9000, 9100, 9500],
    "DevOps Engineer": [6000, 6200, 6400, 6600, 6700, 6900, 7100, 7300],
    "Game Dev": [4000, 4200, 4300, 4500, 4600, 4700, 4800, 5000]
};

const careerOccupationData = {
    "Desenvolvedor Front-end": [
        "Criação de sites responsivos",
        "Desenvolvimento de interfaces interativas",
        "Manutenção de páginas web",
        "Criação de sites responsivos",
        "Desenvolvimento de interfaces interativas",
        "Otimização de performance"
    ],
    "Desenvolvedor Back-end": [
        "Implementação de APIs",
        "Gerenciamento de bancos de dados",
        "Desenvolvimento de lógica de sistemas",
        "Gerenciamento de bancos de dados",
        "Segurança de aplicações"
    ],
    "Engenheiro de Dados": [
        "Construção de pipelines de dados",
        "Gerenciamento de big data",
        "Otimização de queries",
        "Gerenciamento de big data",
        "Construção de pipelines de dados"
    ],
    "Desenvolvedor Mobile": [
        "Desenvolvimento de apps Android",
        "Desenvolvimento de apps iOS",
        "Correção de bugs em apps",
        "Desenvolvimento de apps Android",
        "Otimização de apps"
    ],
    "Data Scientist": [
        "Análise de dados",
        "Criação de modelos preditivos",
        "Limpeza de dados",
        "Análise de dados",
        "Visualização de dados"
    ],
    "DevOps Engineer": [
        "Automatização de deploy",
        "Gerenciamento de servidores",
        "Monitoramento de performance",
        "Automatização de deploy",
        "CI/CD pipelines"
    ],
    "Game Dev": [
        "Desenvolvimento de mecânicas de jogo",
        "Implementação de gráficos 3D",
        "Criação de scripts para IA",
        "Desenvolvimento de mecânicas de jogo",
        "Otimização de performance"
    ]
};


// Seleção de carreiras
careerButtons.forEach(button => {
    button.addEventListener('click', function() {
        const career = this.innerText;

        // Toggle selection
        if (this.classList.contains('active')) {
            this.classList.remove('active');
            selectedCareers = selectedCareers.filter(c => c !== career);
        } else {
            this.classList.add('active');
            selectedCareers.push(career);
        }
    });
});

// Ações de estatísticas
statButtons.forEach(button => {
    button.addEventListener('click', function() {
        if (this.innerText === 'Média') {
            if (selectedCareers.length === 1) {
                renderSingleCareerChart();
                showAverageSalary();
            } else if (selectedCareers.length > 1) {
                renderMultipleCareerCharts();
            }
        } else if (this.innerText === 'Comparar') {
            if (selectedCareers.length > 1) {
                renderMultipleCareersComparisonChart();
            }
        } else if (this.innerText === 'Moda') {
            if (selectedCareers.length === 1) {
                showCareerMode();
            }
        }
    });
});

// Renderiza gráfico para uma única carreira
function renderSingleCareerChart() {
    const ctx = document.getElementById('salaryChart').getContext('2d');
    const chartContainer = document.getElementById('salaryChart');
    chartContainer.classList.add('show');

    if (salaryChart) {
        salaryChart.destroy();
    }

    const career = selectedCareers[0];
    const salaries = careerSalaryData[career];

    salaryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: salaries.map((_, index) => `Salário ${index + 1}`),
            datasets: [{
                label: `${career} - Salários`,
                data: salaries,
                borderColor: '#00aaff',
                backgroundColor: 'rgba(255, 255, 255, 0.51)',
                fill: false,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: 'red',
                pointBorderColor: 'red',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `R$${tooltipItem.raw}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Histórico de Salários'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Salário (R$)'
                    },
                    beginAtZero: false
                }
            }
        }
    });
}

// Função para mostrar a média salarial
function showAverageSalary() {
    const career = selectedCareers[0];
    const salaries = careerSalaryData[career];
    const averageSalary = (salaries.reduce((a, b) => a + b, 0) / salaries.length).toFixed(2);
    
    const averageSalaryElement = document.getElementById('averageSalary');
    averageSalaryElement.innerHTML = `<p>Média Salarial: R$ ${averageSalary}</p>`;
}

// Função para mostrar a moda
function showCareerMode() {
    const career = selectedCareers[0];
    const occupations = careerOccupationData[career];

    const frequency = {};
    occupations.forEach(occupation => {
        frequency[occupation] = (frequency[occupation] || 0) + 1;
    });

    // Encontrar a ocupação mais frequente (moda)
    const mode = Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
    
    const averageSalaryElement = document.getElementById('averageSalary');
    averageSalaryElement.innerHTML = `
        <p>Moda Ocupacional (${career}): ${mode}</p>
    `;
}


// Função para renderizar gráfico de comparação de múltiplas carreiras
function renderMultipleCareersComparisonChart() {
    const ctx = document.getElementById('salaryChart').getContext('2d');
    const chartContainer = document.getElementById('salaryChart');
    chartContainer.classList.add('show');

    if (salaryChart) {
        salaryChart.destroy();
    }

    const datasets = selectedCareers.map(career => {
        const salaries = careerSalaryData[career];
        return {
            label: `${career} - Salários`,
            data: salaries,
            borderColor: getRandomColor(),
            backgroundColor: 'rgba(255, 255, 255, 0)',
            fill: false,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: getRandomColor(),
            pointBorderColor: getRandomColor(),
            pointBorderWidth: 2
        };
    });

    salaryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: careerSalaryData[selectedCareers[0]].map((_, index) => `Salário ${index + 1}`),
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `R$${tooltipItem.raw}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Histórico de Salários'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Salário (R$)'
                    },
                    beginAtZero: false
                }
            }
        }
    });
}

// Função auxiliar para gerar cores aleatórias
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
