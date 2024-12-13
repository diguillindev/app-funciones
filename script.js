let chartInstance; // Referencia al gráfico.
    let axesCentered = false; // Estado de los ejes.

    /**
     * Crea un gráfico dinámico basado en los datos calculados.
     * @param {string} canvasId - ID del canvas donde se dibuja el gráfico.
     * @param {string} label - Etiqueta para el gráfico.
     * @param {Array} xValues - Valores de x.
     * @param {Array} yValues - Valores de y correspondientes.
     */
    function createDynamicGraph(canvasId, label, xValues, yValues) {
        const ctx = document.getElementById(canvasId).getContext('2d');

        // Destruye el gráfico existente si ya hay uno.
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
          type: 'scatter',
          data: {
            datasets: [{
              label: label,
              data: xValues.map((x, i) => ({ x: x, y: yValues[i] })),
              borderColor: 'cyan',
              backgroundColor: 'cyan',
              showLine: true,
              tension: 0,
              pointRadius: 4
            }]
          },
          options: {
            responsive: true,
            scales: {
              x: {
                type: 'linear',
                position: 'bottom',
                grid: { color: 'white' },
                ticks: { color: 'white' },
                min: Math.min(...xValues),
                max: Math.max(...xValues),
              },
              y: {
                type: 'linear',
                position: 'left',
                grid: { color: 'orange' },
                ticks: { color: 'white' },
                min: Math.min(...yValues) - 1,
                max: Math.max(...yValues) + 1,
              }
            },
            plugins: {
              legend: {
                display: true,
              }
            }
          }
        });
    }

    /**
     * Centra los ejes del gráfico visualmente o los restaura a su posición original.
     */
    function centerAxes() {
        if (!chartInstance) {
            alert('Primero debe generar un gráfico.');
            return;
        }

        const scales = chartInstance.options.scales;

        if (axesCentered) {
            // Restaura los ejes a su posición original.
            scales.x.position = 'bottom';
            scales.y.position = 'left';
        } else {
            // Cambia la posición de los ejes a 'center'.
            scales.x.position = 'center';
            scales.y.position = 'center';
        }

        axesCentered = !axesCentered; // Alterna el estado.
        chartInstance.update();
    }

    /**
     * Genera una tabla de valores.
     * @param {Array} xValues - Valores de x.
     * @param {Array} yValues - Valores de y correspondientes.
     */
    function populateTable(xValues, yValues) {
        const tableBody = document.getElementById('valuesTable').querySelector('tbody');
        tableBody.innerHTML = '';
        xValues.forEach((x, i) => {
          const row = document.createElement('tr');
          const xCell = document.createElement('td');
          const yCell = document.createElement('td');
          xCell.textContent = x;
          yCell.textContent = yValues[i];
          row.appendChild(xCell);
          row.appendChild(yCell);
          tableBody.appendChild(row);
        });
    }

    // Configura el botón "Generar Gráfico".
    document.getElementById('generateGraphButton').addEventListener('click', () => {
        const funcInput = document.getElementById('functionInput').value;
        const xMin = parseInt(document.getElementById('xMinInput').value);
        const xMax = parseInt(document.getElementById('xMaxInput').value);

        if (!funcInput || isNaN(xMin) || isNaN(xMax)) {
          alert('Por favor, ingrese valores válidos.');
          return;
        }

        let func;
        try {
          func = new Function('x', `return ${funcInput}`);
        } catch {
          alert('La función ingresada no es válida.');
          return;
        }

        const xValues = [];
        const yValues = [];
        for (let x = xMin; x <= xMax; x++) {
          xValues.push(x);
          try {
            yValues.push(func(x));
          } catch {
            alert('Error al evaluar la función.');
            return;
          }
        }

        createDynamicGraph('dynamicGraphCanvas', `f(x) = ${funcInput}`, xValues, yValues);
        populateTable(xValues, yValues);
    });

    // Configura el botón "Centrar Ejes".
    document.getElementById('centerAxesButton').addEventListener('click', centerAxes);