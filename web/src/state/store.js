import { io } from 'socket.io-client'
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const state = {
  api: API,
  socket: null,
  session: null,
  team: null,
  role: 'teacher', // or 'team'
}

export function connectSocket(code) {
  // Por ahora usamos polling en lugar de Socket.IO
  // TODO: Implementar Socket.IO cuando esté disponible
  console.log('📡 Connecting to session:', code);
  
  // Polling cada 1 segundo para actualizar la sesión
  const pollInterval = setInterval(async () => {
    try {
      const res = await fetch(`${API}/sessions/${code}/state`);
      if (res.ok) {
        const sessionData = await res.json();
        console.log('📡 Polling session:', {
          currentMission: sessionData.currentMission,
          totalTimeRemaining: sessionData.totalTimeRemaining,
          status: sessionData.status
        });
        
        if (JSON.stringify(sessionData) !== JSON.stringify(state.session)) {
          console.log('🔄 Session updated:', sessionData);
          console.log('🎯 Current mission:', sessionData.currentMission);
          console.log('⏰ Time remaining:', sessionData.totalTimeRemaining);
          state.session = sessionData;
          render();
        }
      } else {
        console.log('❌ Session polling failed:', res.status, res.statusText);
      }
    } catch (error) {
      console.error('Error polling session:', error);
    }
  }, 1000);
  
  // Guardar el interval para poder limpiarlo después
  state.pollInterval = pollInterval;
}

let listeners = []
export function subscribe(fn){ listeners.push(fn) }
export function render(){ for(const fn of listeners) fn() }

export async function createSession(teacherName){
  try {
    const res = await fetch(`${API}/sessions`, { 
      method:'POST', 
      headers:{'Content-Type':'application/json'}, 
      body: JSON.stringify({ teacherName }) 
    })
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json()
    state.session = data.state
    connectSocket(state.session.code)
    render()
    return data
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

export async function getState(code){
  const res = await fetch(`${API}/sessions/${code}/state`)
  if (res.ok){
    state.session = await res.json()
    connectSocket(code)
    render()
  }
}

export async function joinTeam(code, teamName){
  const res = await fetch(`${API}/teams/${code}/join`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ teamName }) })
  const data = await res.json()
  state.team = data.team
  state.role = 'team'
  render()
}

export async function submitMission(teamId, missionKey, payload){
  const res = await fetch(`${API}/teams/${teamId}/submit/${missionKey}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
  return res.json()
}

export async function askHint(teamId, missionKey){
  const res = await fetch(`${API}/teams/${teamId}/hint/${missionKey}`, { method:'POST' })
  return res.json()
}

export async function submitFinal(teamId, payload){
  const res = await fetch(`${API}/teams/${teamId}/final`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
  return res.json()
}

export async function startSession(code){
  const res = await fetch(`${API}/sessions/${code}/start`, { method:'POST' })
  return res.json()
}

export async function finishSession(code){
  const res = await fetch(`${API}/sessions/${code}/finish`, { method:'POST' })
  return res.json()
}

export async function updateSessionTimers(code, timers){
  const res = await fetch(`${API}/sessions/${code}/timers`, { 
    method:'PUT', 
    headers:{'Content-Type':'application/json'}, 
    body: JSON.stringify(timers) 
  })
  return res.json()
}
