// Storage utilities
const storage = {
    getJournal: () => {
        const data = localStorage.getItem('financial_journal');
        return data ? JSON.parse(data) : [];
    },
    
    saveJournalEntry: (entry) => {
        const journal = storage.getJournal();
        journal.push(entry);
        localStorage.setItem('financial_journal', JSON.stringify(journal));
    },
    
    deleteJournalEntry: (id) => {
        const journal = storage.getJournal();
        const filtered = journal.filter(entry => entry.id !== id);
        localStorage.setItem('financial_journal', JSON.stringify(filtered));
    },
    
    getGoals: () => {
        const data = localStorage.getItem('financial_goals');
        return data ? JSON.parse(data) : [];
    },
    
    saveGoal: (goal) => {
        const goals = storage.getGoals();
        const existingIndex = goals.findIndex(g => g.id === goal.id);
        
        if (existingIndex >= 0) {
            goals[existingIndex] = goal;
        } else {
            goals.push(goal);
        }
        
        localStorage.setItem('financial_goals', JSON.stringify(goals));
    },
    
    deleteGoal: (id) => {
        const goals = storage.getGoals();
        const filtered = goals.filter(g => g.id !== id);
        localStorage.setItem('financial_goals', JSON.stringify(filtered));
    },
    
    getUserProgress: () => {
        const data = localStorage.getItem('user_progress');
        return data ? JSON.parse(data) : { puntos: 0, nivel: 'Novato', logros: [] };
    },
    
    saveUserProgress: (progress) => {
        localStorage.setItem('user_progress', JSON.stringify(progress));
    },
    
    addPoints: (points) => {
        const progress = storage.getUserProgress();
        progress.puntos += points;
        
        if (progress.puntos >= 500) progress.nivel = 'Experto';
        else if (progress.puntos >= 300) progress.nivel = 'Avanzado';
        else if (progress.puntos >= 100) progress.nivel = 'Intermedio';
        else progress.nivel = 'Novato';
        
        storage.saveUserProgress(progress);
    },
    
    addAchievement: (achievementId) => {
        const progress = storage.getUserProgress();
        if (!progress.logros.includes(achievementId)) {
            progress.logros.push(achievementId);
            storage.saveUserProgress(progress);
        }
    },
    
    getTheme: () => {
        return localStorage.getItem('theme_preference') || 'light';
    },
    
    setTheme: (theme) => {
        localStorage.setItem('theme_preference', theme);
    },
    
    getSimulaciones: () => {
        const data = localStorage.getItem('simulaciones_guardadas');
        return data ? JSON.parse(data) : [];
    },
    
    saveSimulacion: (simulacion) => {
        const simulaciones = storage.getSimulaciones();
        simulaciones.push(simulacion);
        localStorage.setItem('simulaciones_guardadas', JSON.stringify(simulaciones));
    }
};

// Calculation utilities
const calculations = {
    calcularInteresCompuesto: (montoInicial, aportacionMensual, tasaInteresAnual, periodoMeses) => {
        const tasaMensual = tasaInteresAnual / 100 / 12;
        let montoTotal = montoInicial;
        const resultados = [];
        
        for (let mes = 1; mes <= periodoMeses; mes++) {
            montoTotal = (montoTotal + aportacionMensual) * (1 + tasaMensual);
            const totalInvertido = montoInicial + aportacionMensual * mes;
            resultados.push({
                mes,
                monto: montoTotal,
                interes: montoTotal - totalInvertido
            });
        }
        
        return { montoFinal: montoTotal, resultados };
    },
    
    formatearMoneda: (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    },
    
    calcularProgresoMeta: (montoActual, montoObjetivo) => {
        if (montoObjetivo === 0) return 0;
        return Math.min((montoActual / montoObjetivo) * 100, 100);
    },
    
    calcularDiasRestantes: (fechaLimite) => {
        const hoy = new Date();
        const limite = new Date(fechaLimite);
        const diffTime = limite.getTime() - hoy.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(diffDays, 0);
    }
};

// Theme management
function initTheme() {
    const theme = storage.getTheme();
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcons(theme);
}

function toggleTheme() {
    const currentTheme = storage.getTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    storage.setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    updateThemeIcons(newTheme);
}

function updateThemeIcons(theme) {
    const icons = document.querySelectorAll('#themeIcon, #themeIcon2');
    icons.forEach(icon => {
        icon.textContent = theme === 'light' ? '🌙' : '☀️';
    });
}

// Navigation
function navigateTo(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    } else {
        console.error('Page not found:', pageId);
        return;
    }
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) {
            link.classList.add('active');
        }
    });
    
    // Close mobile menu
    closeMobileMenu();
    
    // Refresh page data
    refreshPageData(pageId);
    
    // Update URL hash for better navigation
    window.location.hash = pageId;
}

function refreshPageData(pageId) {
    switch(pageId) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'bitacora':
            updateBitacoraList();
            break;
        case 'metas':
            updateMetasList();
            break;
        case 'graficos':
            updateGraficos();
            break;
        case 'gamificacion':
            updateGamificacion();
            break;
        case 'configuracion':
            updateConfiguracion();
            break;
    }
}

// Mobile menu
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.overlay');
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.overlay');
    
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
}

// Dashboard
function updateDashboard() {
    const goals = storage.getGoals();
    const journalEntries = storage.getJournal();
    const userProgress = storage.getUserProgress();
    
    const totalAhorro = goals.reduce((sum, goal) => sum + goal.montoActual, 0);
    const metasCompletadas = goals.filter(g => g.completada).length;
    
    document.getElementById('totalAhorro').textContent = calculations.formatearMoneda(totalAhorro);
    document.getElementById('metasCompletadas').textContent = `${metasCompletadas}/${goals.length}`;
    document.getElementById('entradasBitacora').textContent = journalEntries.length;
    document.getElementById('userPuntos').textContent = userProgress.puntos;
    document.getElementById('userNivel').textContent = userProgress.nivel;
    
    // Recent goals
    const recentGoalsDiv = document.getElementById('recentGoals');
    if (goals.length === 0) {
        recentGoalsDiv.innerHTML = '<div class="empty-state">No tienes metas aún. ¡Crea tu primera meta!</div>';
    } else {
        recentGoalsDiv.innerHTML = goals.slice(0, 3).map(goal => `
            <div class="goal-item">
                <div class="goal-header">
                    <div class="goal-name">${goal.nombre}</div>
                    <div class="goal-amount">${calculations.formatearMoneda(goal.montoActual)} / ${calculations.formatearMoneda(goal.montoObjetivo)}</div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${calculations.calcularProgresoMeta(goal.montoActual, goal.montoObjetivo)}%"></div>
                </div>
            </div>
        `).join('');
    }
    
    // Recent entries
    const recentEntriesDiv = document.getElementById('recentEntries');
    if (journalEntries.length === 0) {
        recentEntriesDiv.innerHTML = '<div class="empty-state">No hay entradas aún. ¡Comienza tu bitácora financiera!</div>';
    } else {
        recentEntriesDiv.innerHTML = journalEntries.slice(-3).reverse().map(entry => `
            <div class="entry-item">
                <div class="entry-header">
                    <div class="entry-title">${entry.sentimiento} ${entry.titulo}</div>
                    <div class="entry-meta">${new Date(entry.fecha).toLocaleDateString('es-MX')} - ${entry.categoria}</div>
                </div>
            </div>
        `).join('');
    }
}

// Simulador
let simulacionResultado = null;

document.getElementById('simuladorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const montoInicial = parseFloat(document.getElementById('montoInicial').value);
    const aportacionMensual = parseFloat(document.getElementById('aportacionMensual').value);
    const tasaInteresAnual = parseFloat(document.getElementById('tasaInteres').value);
    const periodoMeses = parseInt(document.getElementById('periodoMeses').value);
    
    simulacionResultado = calculations.calcularInteresCompuesto(montoInicial, aportacionMensual, tasaInteresAnual, periodoMeses);
    
    document.getElementById('montoFinal').textContent = calculations.formatearMoneda(simulacionResultado.montoFinal);
    document.getElementById('totalInvertido').textContent = calculations.formatearMoneda(montoInicial + aportacionMensual * periodoMeses);
    document.getElementById('interesGanado').textContent = calculations.formatearMoneda(simulacionResultado.montoFinal - (montoInicial + aportacionMensual * periodoMeses));
    
    document.getElementById('resultadoCard').style.display = 'block';
    document.getElementById('progresoCard').style.display = 'block';
    
    // Update table
    const tbody = document.querySelector('#progresoTable tbody');
    tbody.innerHTML = simulacionResultado.resultados.map(r => `
        <tr>
            <td>${r.mes}</td>
            <td>${calculations.formatearMoneda(r.monto)}</td>
            <td>${calculations.formatearMoneda(r.interes)}</td>
        </tr>
    `).join('');
});

function guardarSimulacion() {
    if (!simulacionResultado) return;
    
    const simulacion = {
        id: Date.now().toString(),
        fecha: new Date().toISOString(),
        montoInicial: parseFloat(document.getElementById('montoInicial').value),
        aportacionMensual: parseFloat(document.getElementById('aportacionMensual').value),
        tasaInteresAnual: parseFloat(document.getElementById('tasaInteres').value),
        periodoMeses: parseInt(document.getElementById('periodoMeses').value),
        resultado: simulacionResultado
    };
    
    storage.saveSimulacion(simulacion);
    storage.addPoints(10);
    showToast('¡Simulación guardada! +10 puntos', 'success');
}

// Bitácora
let selectedSentiment = '😊';

document.querySelectorAll('.sentiment-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.sentiment-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedSentiment = this.dataset.sentiment;
        document.getElementById('entradaSentimiento').value = selectedSentiment;
    });
});

document.getElementById('bitacoraForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const entrada = {
        id: Date.now().toString(),
        fecha: new Date().toISOString(),
        titulo: document.getElementById('entradaTitulo').value,
        categoria: document.getElementById('entradaCategoria').value,
        sentimiento: document.getElementById('entradaSentimiento').value,
        contenido: document.getElementById('entradaContenido').value
    };
    
    storage.saveJournalEntry(entrada);
    storage.addPoints(10);
    
    const journalEntries = storage.getJournal();
    if (journalEntries.length === 1) {
        storage.addAchievement('primera_entrada');
    }
    
    this.reset();
    selectedSentiment = '😊';
    document.querySelectorAll('.sentiment-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.sentiment-btn[data-sentiment="😊"]').classList.add('active');
    
    updateBitacoraList();
    showToast('¡Entrada guardada! +10 puntos', 'success');
});

function updateBitacoraList() {
    const entries = storage.getJournal();
    const entriesDiv = document.getElementById('entradasList');
    
    if (entries.length === 0) {
        entriesDiv.innerHTML = '<div class="empty-state">No hay entradas aún. ¡Comienza tu bitácora financiera!</div>';
    } else {
        entriesDiv.innerHTML = entries.slice().reverse().map(entry => `
            <div class="entry-item">
                <div class="entry-header">
                    <div class="entry-title">${entry.sentimiento} ${entry.titulo}</div>
                    <div class="entry-delete" onclick="eliminarEntrada('${entry.id}')">Eliminar</div>
                </div>
                <div class="entry-meta">${new Date(entry.fecha).toLocaleDateString('es-MX')} - ${entry.categoria}</div>
                <div class="entry-content">${entry.contenido}</div>
            </div>
        `).join('');
    }
}

function eliminarEntrada(id) {
    if (confirm('¿Estás seguro de eliminar esta entrada?')) {
        storage.deleteJournalEntry(id);
        updateBitacoraList();
    }
}

// Metas
let editingMetaId = null;

document.getElementById('metaForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const meta = {
        id: editingMetaId || Date.now().toString(),
        nombre: document.getElementById('metaNombre').value,
        montoObjetivo: parseFloat(document.getElementById('metaMontoObjetivo').value),
        montoActual: editingMetaId ? parseFloat(document.getElementById('metaMontoActual').value) : 0,
        fechaLimite: document.getElementById('metaFechaLimite').value,
        categoria: document.getElementById('metaCategoria').value,
        completada: false
    };
    
    meta.completada = meta.montoActual >= meta.montoObjetivo;
    
    storage.saveGoal(meta);
    storage.addPoints(50);
    
    if (!editingMetaId) {
        const goals = storage.getGoals();
        if (goals.length === 1) {
            storage.addAchievement('primera_meta');
        }
    }
    
    cancelarEdicionMeta();
    updateMetasList();
    showToast(editingMetaId ? '¡Meta actualizada! +50 puntos' : '¡Meta creada! +50 puntos', 'success');
});

function updateMetasList() {
    const goals = storage.getGoals();
    const metasDiv = document.getElementById('metasList');
    
    const categoriaIconos = {
        general: '🎯',
        viaje: '✈️',
        casa: '🏠',
        coche: '🚗',
        educacion: '📚',
        emergencia: '🆘',
        inversion: '📈',
        retiro: '🏖️'
    };
    
    if (goals.length === 0) {
        metasDiv.innerHTML = '<div class="empty-state">No tienes metas aún. ¡Crea tu primera meta financiera!</div>';
    } else {
        metasDiv.innerHTML = goals.map(goal => {
            const progreso = calculations.calcularProgresoMeta(goal.montoActual, goal.montoObjetivo);
            const diasRestantes = calculations.calcularDiasRestantes(goal.fechaLimite);
            
            return `
                <div class="goal-item ${goal.completada ? 'completed' : ''}">
                    <div class="goal-header">
                        <div class="goal-name">${categoriaIconos[goal.categoria] || '🎯'} ${goal.nombre}</div>
                        ${goal.completada ? '<span>✅</span>' : ''}
                    </div>
                    <div class="goal-amount">${calculations.formatearMoneda(goal.montoActual)} / ${calculations.formatearMoneda(goal.montoObjetivo)}</div>
                    <div class="goal-amount">${diasRestantes > 0 ? diasRestantes + ' días restantes' : 'Fecha límite alcanzada'}</div>
                    <div class="progress-bar">
                        <div class="progress-fill ${goal.completada ? 'completed' : ''}" style="width: ${progreso}%"></div>
                    </div>
                    <div class="goal-actions">
                        <button class="btn btn-secondary" onclick="editarMeta('${goal.id}')">Editar</button>
                        <button class="btn btn-secondary" onclick="actualizarProgresoMeta('${goal.id}')">Actualizar</button>
                        <button class="btn btn-danger" onclick="eliminarMeta('${goal.id}')">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function editarMeta(id) {
    const goals = storage.getGoals();
    const goal = goals.find(g => g.id === id);
    
    if (goal) {
        editingMetaId = id;
        document.getElementById('metaId').value = id;
        document.getElementById('metaNombre').value = goal.nombre;
        document.getElementById('metaMontoObjetivo').value = goal.montoObjetivo;
        document.getElementById('metaMontoActual').value = goal.montoActual;
        document.getElementById('metaFechaLimite').value = new Date(goal.fechaLimite).toISOString().split('T')[0];
        document.getElementById('metaCategoria').value = goal.categoria;
        
        document.getElementById('metaFormTitle').textContent = 'Editar Meta';
        document.getElementById('metaSubmitBtn').textContent = '💾 Actualizar';
        document.getElementById('metaMontoActualGroup').style.display = 'flex';
        document.getElementById('metaCancelBtn').style.display = 'block';
    }
}

function cancelarEdicionMeta() {
    editingMetaId = null;
    document.getElementById('metaForm').reset();
    document.getElementById('metaFormTitle').textContent = 'Nueva Meta';
    document.getElementById('metaSubmitBtn').textContent = '💾 Crear Meta';
    document.getElementById('metaMontoActualGroup').style.display = 'none';
    document.getElementById('metaCancelBtn').style.display = 'none';
}

function actualizarProgresoMeta(id) {
    const goals = storage.getGoals();
    const goal = goals.find(g => g.id === id);
    
    if (goal) {
        const nuevoMonto = prompt('Nuevo monto actual:', goal.montoActual.toString());
        if (nuevoMonto !== null) {
            const actualizada = { ...goal, montoActual: parseFloat(nuevoMonto), completada: parseFloat(nuevoMonto) >= goal.montoObjetivo };
            storage.saveGoal(actualizada);
            
            if (actualizada.completada && !goal.completada) {
                storage.addPoints(100);
                storage.addAchievement('meta_completada');
                showToast('¡Felicidades! Meta completada 🎉 +100 puntos', 'success');
            }
            
            updateMetasList();
        }
    }
}

function eliminarMeta(id) {
    if (confirm('¿Estás seguro de eliminar esta meta?')) {
        storage.deleteGoal(id);
        updateMetasList();
    }
}

// Gráficos
function updateGraficos() {
    const goals = storage.getGoals();
    const journalEntries = storage.getJournal();
    
    // Metas progress
    const graficosMetasDiv = document.getElementById('graficosMetas');
    if (goals.length === 0) {
        graficosMetasDiv.innerHTML = '<div class="empty-state">No hay metas para mostrar</div>';
    } else {
        graficosMetasDiv.innerHTML = goals.map(goal => {
            const progreso = calculations.calcularProgresoMeta(goal.montoActual, goal.montoObjetivo);
            return `
                <div class="chart-bar">
                    <div class="chart-bar-header">
                        <span class="chart-bar-label">${goal.nombre}</span>
                        <span class="chart-bar-value">${calculations.formatearMoneda(goal.montoActual)} / ${calculations.formatearMoneda(goal.montoObjetivo)}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${goal.completada ? 'completed' : ''}" style="width: ${progreso}%"></div>
                    </div>
                    <div class="chart-bar-value">${progreso.toFixed(1)}%</div>
                </div>
            `;
        }).join('');
    }
    
    // Entradas distribution
    const graficosEntradasDiv = document.getElementById('graficosEntradas');
    if (journalEntries.length === 0) {
        graficosEntradasDiv.innerHTML = '<div class="empty-state">No hay entradas para mostrar</div>';
    } else {
        const categoriaData = journalEntries.reduce((acc, entry) => {
            acc[entry.categoria] = (acc[entry.categoria] || 0) + 1;
            return acc;
        }, {});
        
        const categoriaLabels = {
            ahorro: '💰 Ahorro',
            gasto: '💸 Gasto',
            emocion: '💭 Emoción'
        };
        
        graficosEntradasDiv.innerHTML = Object.entries(categoriaData).map(([categoria, count]) => {
            const porcentaje = (count / journalEntries.length) * 100;
            return `
                <div class="chart-bar">
                    <div class="chart-bar-header">
                        <span class="chart-bar-label">${categoriaLabels[categoria] || categoria}</span>
                        <span class="chart-bar-value">${count} entradas (${porcentaje.toFixed(1)}%)</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${categoria}" style="width: ${porcentaje}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Resumen general
    const totalAhorro = goals.reduce((sum, goal) => sum + goal.montoActual, 0);
    const totalObjetivo = goals.reduce((sum, goal) => sum + goal.montoObjetivo, 0);
    
    document.getElementById('resumenGeneral').innerHTML = `
        <div class="result-item">
            <div class="result-item-label">Total Ahorrado</div>
            <div class="result-item-value">${calculations.formatearMoneda(totalAhorro)}</div>
        </div>
        <div class="result-item">
            <div class="result-item-label">Total Objetivo</div>
            <div class="result-item-value">${calculations.formatearMoneda(totalObjetivo)}</div>
        </div>
        <div class="result-item">
            <div class="result-item-label">Progreso Global</div>
            <div class="result-item-value">${totalObjetivo > 0 ? ((totalAhorro / totalObjetivo) * 100).toFixed(1) : 0}%</div>
        </div>
        <div class="result-item">
            <div class="result-item-label">Metas Completadas</div>
            <div class="result-item-value">${goals.filter(g => g.completada).length} / ${goals.length}</div>
        </div>
    `;
    
    // Estadísticas bitácora
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const entradasSemana = journalEntries.filter(e => new Date(e.fecha) >= weekAgo).length;
    
    const categoriaData = journalEntries.reduce((acc, entry) => {
        acc[entry.categoria] = (acc[entry.categoria] || 0) + 1;
        return acc;
    }, {});
    
    const categoriaMasFrecuente = Object.entries(categoriaData).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    
    document.getElementById('estadisticasBitacora').innerHTML = `
        <div class="result-item">
            <div class="result-item-label">Total Entradas</div>
            <div class="result-item-value">${journalEntries.length}</div>
        </div>
        <div class="result-item">
            <div class="result-item-label">Entradas esta semana</div>
            <div class="result-item-value">${entradasSemana}</div>
        </div>
        <div class="result-item">
            <div class="result-item-label">Categoría más frecuente</div>
            <div class="result-item-value">${categoriaMasFrecuente}</div>
        </div>
    `;
}

// Gamificación
function updateGamificacion() {
    const userProgress = storage.getUserProgress();
    
    const nivelIconos = {
        'Novato': '🌱',
        'Intermedio': '📈',
        'Avanzado': '🚀',
        'Experto': '👑'
    };
    
    const niveles = [
        { nombre: 'Novato', puntosMin: 0 },
        { nombre: 'Intermedio', puntosMin: 100 },
        { nombre: 'Avanzado', puntosMin: 300 },
        { nombre: 'Experto', puntosMin: 500 }
    ];
    
    const nivelActual = niveles.find(n => userProgress.nivel === n.nombre) || niveles[0];
    const siguienteNivel = niveles.find(n => n.puntosMin > userProgress.puntos);
    const puntosParaSiguiente = siguienteNivel ? siguienteNivel.puntosMin - userProgress.puntos : 0;
    
    document.getElementById('nivelIcon').textContent = nivelIconos[userProgress.nivel] || '🌱';
    document.getElementById('nivelNombre').textContent = userProgress.nivel;
    document.getElementById('nivelPuntos').textContent = userProgress.puntos + ' puntos';
    document.getElementById('nivelProgreso').textContent = siguienteNivel ? puntosParaSiguiente + ' puntos para ' + siguienteNivel.nombre : '¡Nivel máximo!';
    
    const progreso = siguienteNivel 
        ? ((userProgress.puntos - nivelActual.puntosMin) / (siguienteNivel.puntosMin - nivelActual.puntosMin)) * 100 
        : 100;
    document.getElementById('nivelProgressBar').style.width = progreso + '%';
    
    const logrosDisponibles = [
        { id: 'primera_entrada', nombre: 'Primera Entrada', descripcion: 'Escribe tu primera entrada en la bitácora', icono: '📝', puntos: 10 },
        { id: 'primera_meta', nombre: 'Primera Meta', descripcion: 'Crea tu primera meta financiera', icono: '🎯', puntos: 50 },
        { id: 'meta_completada', nombre: 'Meta Alcanzada', descripcion: 'Completa tu primera meta', icono: '🏆', puntos: 100 },
        { id: 'ahorrador_constante', nombre: 'Ahorrador Constante', descripcion: 'Guarda 5 simulaciones', icono: '💰', puntos: 50 },
        { id: 'mes_perfecto', nombre: 'Mes Perfecto', descripcion: 'Escribe 10 entradas en un mes', icono: '⭐', puntos: 100 },
        { id: 'experto_financiero', nombre: 'Experto Financiero', descripcion: 'Alcanza el nivel Experto', icono: '👑', puntos: 200 },
    ];
    
    const logrosDesbloqueados = logrosDisponibles.filter(l => userProgress.logros.includes(l.id));
    const logrosPendientes = logrosDisponibles.filter(l => !userProgress.logros.includes(l.id));
    
    document.getElementById('logrosDesbloqueados').innerHTML = logrosDesbloqueados.length === 0 
        ? '<div class="empty-state">Aún no has desbloqueado logros. ¡Sigue usando la app!</div>'
        : `<div class="achievement-grid">${logrosDesbloqueados.map(logro => `
            <div class="achievement-item unlocked">
                <div class="achievement-icon">${logro.icono}</div>
                <div class="achievement-name">${logro.nombre}</div>
                <div class="achievement-desc">${logro.descripcion}</div>
                <div class="achievement-points">+${logro.puntos} puntos</div>
            </div>
        `).join('')}</div>`;
    
    document.getElementById('logrosPendientes').innerHTML = logrosPendientes.length === 0
        ? '<div class="empty-state">¡Felicidades! Has desbloqueado todos los logros 🎉</div>'
        : `<div class="achievement-grid">${logrosPendientes.map(logro => `
            <div class="achievement-item locked">
                <div class="achievement-icon">${logro.icono}</div>
                <div class="achievement-name">${logro.nombre}</div>
                <div class="achievement-desc">${logro.descripcion}</div>
                <div class="achievement-points">+${logro.puntos} puntos</div>
            </div>
        `).join('')}</div>`;
}

// Configuración
function updateConfiguracion() {
    const goals = storage.getGoals();
    const journalEntries = storage.getJournal();
    const simulaciones = storage.getSimulaciones();
    const userProgress = storage.getUserProgress();
    
    document.getElementById('statEntradas').textContent = journalEntries.length;
    document.getElementById('statMetas').textContent = goals.length;
    document.getElementById('statSimulaciones').textContent = simulaciones.length;
    document.getElementById('statPuntos').textContent = userProgress.puntos;
}

function exportarDatos() {
    const datos = {
        journal: storage.getJournal(),
        goals: storage.getGoals(),
        userProgress: storage.getUserProgress(),
        simulaciones: storage.getSimulaciones(),
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finplan-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function confirmarEliminacion() {
    if (confirm('¿Estás seguro de eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('financial_journal');
        localStorage.removeItem('financial_goals');
        localStorage.removeItem('user_progress');
        localStorage.removeItem('simulaciones_guardadas');
        localStorage.removeItem('theme_preference');
        showToast('Todos los datos han sido eliminados', 'success');
        setTimeout(() => location.reload(), 2000);
    }
}

// Toast notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Theme toggle listeners
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('themeToggle2').addEventListener('click', toggleTheme);
    
    // Navigation listeners
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo(this.dataset.page);
        });
    });
    
    // Mobile menu
    document.getElementById('mobileMenuBtn').addEventListener('click', toggleMobileMenu);
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.addEventListener('click', closeMobileMenu);
    document.body.appendChild(overlay);
    
    // Initialize sentiment button
    document.querySelector('.sentiment-btn[data-sentiment="😊"]').classList.add('active');
    
    // Handle URL hash on load
    const hash = window.location.hash.slice(1);
    if (hash) {
        navigateTo(hash);
    } else {
        updateDashboard();
    }
    
    // Handle hash changes
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.slice(1);
        if (hash) {
            navigateTo(hash);
        }
    });
});
