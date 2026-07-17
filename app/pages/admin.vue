<template>
  <div>
    <!-- 1. GÜVENLİ ADMİN GİRİŞ EKRANI -->
    <div v-if="!isAuthenticated" class="max-w-sm mx-auto mt-12 bg-white dark:bg-white/[0.06] p-8 rounded-2xl border border-slate-100 dark:border-white/10 shadow-lg text-center space-y-6">
      <div class="w-12 h-12 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white rounded-full flex items-center justify-center mx-auto text-xl border border-slate-200/60 dark:border-white/10">🔒</div>
      <div>
        <h2 class="text-xl font-extrabold text-slate-900 dark:text-white">Admin Login</h2>
        <p class="text-slate-500 dark:text-slate-300 text-xs mt-1">Only authorized organization personnel can access this area.</p>
      </div>
      <form @submit.prevent="checkPassword" class="space-y-4">
        <input v-model="inputPassword" type="password" placeholder="Admin Password..." class="w-full px-4 py-2.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-center tracking-widest dark:text-white focus:outline-none focus:border-slate-500" autofocus />
        <p v-if="errorMessage" class="text-rose-500 text-xs font-semibold mt-2 animate-bounce">{{ errorMessage }}</p>
        <button type="submit" :disabled="isLoading" class="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50">
          {{ isLoading ? 'Verifying...' : 'Login' }}
        </button>
      </form>
    </div>

    <!-- 2. ANA YÖNETİM PANELİ -->
    <div v-else class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Panel</h1>
            <span class="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border border-emerald-200 dark:border-emerald-500/30">Secure Session</span>
          </div>
          <p class="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage conference feeds, announcements, and schedule kalıcı olarak buradan yönetilir.</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex gap-1 bg-slate-100 dark:bg-white/[0.06] p-1 rounded-xl border border-slate-200/60 dark:border-white/10">
            <button @click="activeTab = 'schedule'" :class="['px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all', activeTab === 'schedule' ? 'bg-slate-900 text-white dark:bg-white/20 dark:text-white shadow-sm dark:border dark:border-white/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white']">📅 Schedule</button>
            <button @click="activeTab = 'announcements'" :class="['px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all', activeTab === 'announcements' ? 'bg-slate-900 text-white dark:bg-white/20 dark:text-white shadow-sm dark:border dark:border-white/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white']">📢 Announcements</button>
            <button @click="activeTab = 'feedbacks'" :class="['px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all', activeTab === 'feedbacks' ? 'bg-slate-900 text-white dark:bg-white/20 dark:text-white shadow-sm dark:border dark:border-white/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white']">💬 Feedbacks</button>
          </div>
          <button @click="logout" class="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 px-3 py-2 rounded-xl text-xs font-bold transition-colors">Logout 🚪</button>
        </div>
      </div>

      <!-- DAILY REMINDER YÖNETİM ALANI -->
      <div class="bg-white dark:bg-white/[0.06] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">⚡</span>
            <h3 class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">Daily Reminder & Banner Management</h3>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500 dark:text-slate-400 font-semibold">Status:</span>
            <button @click="toggleReminderActive" :class="['px-3 py-1 rounded-full text-xs font-bold transition-colors shadow-2xs', dailyReminder.active ? 'bg-emerald-600 text-white' : 'bg-slate-700 dark:bg-white/20 text-white']">
              {{ dailyReminder.active ? '🟢 Visible on Site' : '🔴 Hidden' }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Banner Type / Color</label>
            <select v-model="dailyReminder.type" class="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-500">
              <option value="info">💡 Info (Slate/Blue)</option>
              <option value="warning">⚠️ Warning (Amber/Yellow)</option>
              <option value="urgent">🚨 Urgent (Rose/Red)</option>
            </select>
          </div>
          <div class="sm:col-span-2">
            <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Title / Heading</label>
            <input v-model="dailyReminder.title" type="text" placeholder="e.g., Daily Reminder, Dress Code, Lunch Time..." class="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-500" />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 items-end">
          <div class="flex-1 w-full">
            <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Message Content</label>
            <input v-model="dailyReminder.message" type="text" placeholder="Write the note delegates should see today..." class="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-500" />
          </div>
          <button @click="saveReminder" class="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold px-6 py-2 rounded-xl text-xs transition-colors shadow-sm shrink-0">
            💾 Save Reminder
          </button>
        </div>
      </div>

      <!-- TAB: SCHEDULE MANAGEMENT -->
      <div v-if="activeTab === 'schedule'" class="space-y-6">
        
        <!-- ADMİN ROL SEÇİCİ -->
        <div class="bg-indigo-50/50 dark:bg-indigo-500/10 border-2 border-indigo-200 dark:border-indigo-500/20 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="space-y-1 text-center sm:text-left">
            <h3 class="font-black text-sm sm:text-base text-indigo-900 dark:text-indigo-300">👥 Select Schedule to Manage</h3>
            <p class="text-xs text-indigo-700 dark:text-indigo-200">Şu anda hangi ekibin programını düzenlemek istediğinizi seçin. Eklediğiniz her oturum veya Excel dosyası SADECE bu gruba işlenir.</p>
          </div>
          <div class="flex items-center gap-1.5 bg-white dark:bg-black/40 p-1.5 rounded-xl border border-indigo-100 dark:border-indigo-500/20 shadow-xs">
            <button @click="adminScheduleRole = 'delegates'" :class="['px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2', adminScheduleRole === 'delegates' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white']">
              <span>👤</span> Delegates
            </button>
            <button @click="adminScheduleRole = 'officials'" :class="['px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2', adminScheduleRole === 'officials' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white']">
              <span>👔</span> Officials
            </button>
          </div>
        </div>

        <!-- EXCEL İMPORT / EXPORT ALANI -->
        <div class="bg-slate-100/70 dark:bg-white/[0.04] border-2 border-dashed border-slate-300 dark:border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="space-y-1 text-center sm:text-left">
            <div class="flex items-center justify-center sm:justify-start gap-2">
              <span class="text-xl">📑</span>
              <h3 class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">Import <span class="uppercase text-indigo-500">{{ adminScheduleRole }}</span> Schedule via Excel</h3>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400">Sadece gün, saat, başlık, mekan doldurun. Yüklediğiniz dosya otomatik olarak <b class="uppercase">{{ adminScheduleRole }}</b> veritabanına kaydedilecektir.</p>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-2 shrink-0 w-full sm:w-auto">
            <button @click="downloadExcelTemplate" class="bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-white/20 transition-colors flex items-center gap-1.5 shadow-2xs">
              <span>📥 Download Template</span>
            </button>
            <label class="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm">
              <span>📤 Upload Excel</span>
              <input type="file" accept=".xlsx, .xls" @change="handleExcelUpload" class="hidden" />
            </label>
          </div>
        </div>

        <!-- Yeni Gün Ekle -->
        <div class="bg-white dark:bg-white/[0.06] p-5 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div class="space-y-3 w-full sm:w-auto flex-1">
            <h3 class="font-bold text-sm text-slate-900 dark:text-white">✨ Add New Day to <span class="uppercase text-indigo-400">{{ adminScheduleRole }}</span></h3>
            <div class="flex flex-col sm:flex-row gap-3">
              <input v-model="newDay.label" type="text" placeholder="e.g., Day 1 - Teambuilding" class="bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-500 w-full sm:w-64" />
              <input v-model="newDay.date" type="text" placeholder="e.g., July 19, 2026" class="bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-500 w-full sm:w-48" />
            </div>
          </div>
          <button @click="addNewDay" class="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold px-5 py-2 rounded-xl text-sm transition-colors w-full sm:w-auto">+ Create Day</button>
        </div>

        <!-- Oturum Düzenleme Kutusu -->
        <div v-if="editingSessionId" class="bg-amber-50/70 dark:bg-amber-500/10 p-6 rounded-2xl border border-amber-200 dark:border-amber-500/20 shadow-sm space-y-4 animate-fade-in">
          <div class="flex items-center justify-between border-b border-amber-200/60 dark:border-amber-500/20 pb-2">
            <div class="flex items-center gap-2">
              <span class="text-lg">✏️</span>
              <h3 class="font-extrabold text-amber-900 dark:text-amber-300 text-sm">Edit Session Details</h3>
            </div>
            <button @click="cancelEditingSession" class="text-xs font-bold text-rose-600 hover:underline">❌ Cancel</button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase mb-1">Time</label>
              <input v-model="editSessionForm.time" type="text" class="w-full px-3 py-1.5 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl text-sm dark:text-white focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase mb-1">Title</label>
              <input v-model="editSessionForm.title" type="text" class="w-full px-3 py-1.5 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl text-sm dark:text-white focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase mb-1">Speaker</label>
              <input v-model="editSessionForm.speaker" type="text" class="w-full px-3 py-1.5 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl text-sm dark:text-white focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase mb-1">Location</label>
              <input v-model="editSessionForm.location" type="text" class="w-full px-3 py-1.5 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl text-sm dark:text-white focus:outline-none focus:border-amber-500" />
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-1">
            <button @click="cancelEditingSession" class="bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white font-medium px-4 py-2 rounded-xl text-xs hover:bg-slate-300 dark:hover:bg-white/20 transition-colors">Cancel</button>
            <button @click="updateSession" class="bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2 rounded-xl text-xs transition-colors shadow-sm">💾 Update Session</button>
          </div>
        </div>

        <!-- Yeni Oturum Ekle -->
        <div v-else class="bg-white dark:bg-white/[0.06] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-2">
            <h3 class="font-bold text-slate-800 dark:text-white text-sm">Add Session to Selected Day</h3>
            <select v-model="selectedDayId" class="bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 font-bold text-xs px-3 py-1.5 rounded-xl focus:outline-none">
              <option v-for="day in sortedDays" :key="day.id" :value="day.id">{{ day.label }} — [ {{ day.date }} ]</option>
            </select>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <input v-model="newSession.time" type="text" placeholder="Time (e.g., 09:30 - 10:30)" class="px-3 py-1.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-500" />
            <input v-model="newSession.title" type="text" placeholder="Session Title" class="px-3 py-1.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-500" />
            <input v-model="newSession.speaker" type="text" placeholder="Speaker / Committee" class="px-3 py-1.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-500" />
            <input v-model="newSession.location" type="text" placeholder="Room / Location" class="px-3 py-1.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-500" />
          </div>
          <button @click="addSession" class="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Add Session</button>
        </div>

        <!-- Mevcut Program Listesi -->
        <div class="space-y-4">
          <div v-for="day in sortedDays" :key="day.id" class="bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 rounded-2xl p-5 space-y-3 shadow-2xs">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div class="flex items-center gap-2">
                <span class="font-extrabold text-slate-900 dark:text-white text-sm">📌 {{ day.label }}</span>
                <span class="bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-md border border-slate-200/60 dark:border-white/10">
                  📅 {{ day.date }}
                </span>
              </div>
              <button @click="deleteDay(day.id)" class="text-xs text-rose-500 hover:text-rose-400 font-semibold">Delete Day</button>
            </div>
            <div class="space-y-2">
              <div v-for="session in getSortedSessionsByDay(day.id)" :key="session.id" class="bg-slate-50 dark:bg-black/20 p-3.5 rounded-xl border border-slate-200/60 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span class="font-bold bg-white dark:bg-white/10 px-2.5 py-1 rounded-lg text-slate-800 dark:text-white border border-slate-200 dark:border-white/10">{{ session.time }}</span>
                  <span class="font-extrabold text-slate-900 dark:text-white">{{ session.title }}</span>
                  <span class="text-slate-400 dark:text-slate-300">({{ session.speaker }} - {{ session.location }})</span>
                </div>
                <div class="flex items-center gap-3 self-end sm:self-auto shrink-0 border-t sm:border-t-0 border-slate-200 dark:border-white/10 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                  <button @click="startEditingSession(session)" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Edit ✏️</button>
                  <button @click="deleteSession(session.id)" class="text-rose-500 dark:text-rose-400 font-bold hover:underline">Delete 🗑️</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: ANNOUNCEMENTS -->
      <div v-if="activeTab === 'announcements'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-white/[0.06] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
          <h3 class="font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2 text-sm">Publish Announcement</h3>
          <input v-model="newAnnounce.category" type="text" placeholder="Category (e.g., Urgent)" class="w-full px-3 py-1.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-500" />
          <input v-model="newAnnounce.title" type="text" placeholder="Title" class="w-full px-3 py-1.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-500" />
          <textarea v-model="newAnnounce.desc" rows="3" placeholder="Content details..." class="w-full px-3 py-1.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-500"></textarea>
          <button @click="addAnnouncement" class="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-colors">Publish</button>
        </div>
        <div class="md:col-span-2 space-y-3">
          <div v-for="(item, idx) in announcements" :key="idx" class="bg-white dark:bg-white/[0.06] p-5 rounded-2xl border border-slate-200 dark:border-white/10 flex items-start justify-between shadow-2xs">
            <div class="space-y-1">
              <span class="text-[10px] font-black bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white px-2.5 py-0.5 rounded-md uppercase border border-slate-200/60 dark:border-white/10">{{ item.category }}</span>
              <h4 class="font-bold text-slate-900 dark:text-white text-sm">{{ item.title }}</h4>
              <p class="text-slate-500 dark:text-slate-300 text-xs">{{ item.desc }}</p>
            </div>
            <button @click="deleteAnnouncement(idx)" class="text-rose-500 hover:text-rose-400 text-xs font-semibold shrink-0">Delete</button>
          </div>
        </div>
      </div>

      <!-- TAB: FEEDBACKS -->
      <div v-if="activeTab === 'feedbacks'" class="space-y-3">
        <div v-for="item in feedbacks" :key="item.id" class="bg-white dark:bg-white/[0.06] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xs flex justify-between">
          <div class="space-y-1">
            <span class="font-bold text-slate-900 dark:text-white text-sm">{{ item.name }}</span>
            <span class="text-xs bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white ml-2 px-2.5 py-0.5 rounded-md font-extrabold border border-slate-200/60 dark:border-white/10">{{ item.category }}</span>
            <p class="text-slate-600 dark:text-slate-200 text-sm bg-slate-50 dark:bg-black/20 p-3.5 rounded-xl mt-2 border border-slate-200/80 dark:border-white/10">{{ item.message }}</p>
          </div>
          <button @click="deleteFeedback(item.id)" class="text-rose-500 hover:text-rose-400 text-xs self-start font-semibold">Archive</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import * as XLSX from 'xlsx'

const { days, sessions, announcements, feedbacks, dailyReminder, refreshData, saveAll } = useConferenceData()

const isAuthenticated = ref(false)
const inputPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const activeTab = ref('schedule')

const adminScheduleRole = ref('delegates')
const selectedDayId = ref(null)

const editingSessionId = ref(null)
const editSessionForm = reactive({ dayId: null, time: '', title: '', speaker: '', location: '' })

const newDay = reactive({ label: '', date: '' })
const newSession = reactive({ time: '', title: '', speaker: '', location: '' })
const newAnnounce = reactive({ category: '', title: '', desc: '' })

onMounted(async () => {
  await refreshData()
  if (typeof window !== 'undefined' && localStorage.getItem('eyp_secure_auth_token')) {
    isAuthenticated.value = true
  }
  if (sortedDays.value.length > 0) selectedDayId.value = sortedDays.value[0].id
})

const sortedDays = computed(() => {
  if (!days.value) return []
  return [...days.value]
    .filter(d => (d.role || 'delegates') === adminScheduleRole.value)
    .sort((a, b) => parseDateStr(a.date) - parseDateStr(b.date))
})

const getSortedSessionsByDay = (dayId) => {
  return [...sessions.value]
    .filter(s => s.dayId === dayId && (s.role || 'delegates') === adminScheduleRole.value)
    .sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time))
}

watch(adminScheduleRole, () => {
  if (sortedDays.value.length > 0) {
    selectedDayId.value = sortedDays.value[0].id
  } else {
    selectedDayId.value = null
  }
})

const downloadExcelTemplate = () => {
  const workbook = XLSX.utils.book_new()
  
  const sampleDays = [
    {
      sheetName: 'Day 1 - Start',
      date: 'July 19, 2026',
      sessions: [
        { Time: '09:00 - 10:30', Title: 'Morning Session', Speaker: 'Speaker Name', Location: 'Main Hall' },
        { Time: '11:00 - 12:30', Title: 'Second Session', Speaker: 'Another Speaker', Location: 'Room 2' }
      ]
    }
  ]

  sampleDays.forEach((day) => {
    const dateHeaderRow = {
      Time: '📅 GÜNÜN TARİHİ:',
      Title: day.date,
      Speaker: '--- SADECE B1 HÜCRESİNDEKİ TARİHİ DEĞİŞTİRİN ---',
      Location: ''
    }

    const descriptionRow = {
      Time: 'ℹ️ ÖRN: 09:00 - 10:30',
      Title: 'ℹ️ ÖRN: Oturum Adı',
      Speaker: 'ℹ️ ÖRN: Konuşmacı',
      Location: 'ℹ️ ÖRN: Salon'
    }
    
    const sheetData = [dateHeaderRow, descriptionRow, ...day.sessions]
    const worksheet = XLSX.utils.json_to_sheet(sheetData)
    
    worksheet['!cols'] = [ { wch: 28 }, { wch: 45 }, { wch: 35 }, { wch: 25 } ]
    XLSX.utils.book_append_sheet(workbook, worksheet, day.sheetName)
  })

  XLSX.writeFile(workbook, `Istanbul_NS26_${adminScheduleRole.value.toUpperCase()}_Schedule.xlsx`)
}

const handleExcelUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })

      const newDaysArray = []
      const newSessionsArray = []

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        if (!jsonData || jsonData.length === 0) return

        let detectedDate = 'TBA'
        const dateRow = jsonData.find(r => String(r.Time || r.time || '').includes('📅') || String(r.Time || r.time || '').toLowerCase().includes('tarih'))
        if (dateRow) {
          detectedDate = dateRow.Title || dateRow.title || 'TBA'
        }

        const validRows = jsonData.filter(row => {
          const tStr = String(row.Time || row.time || '')
          const titleStr = String(row.Title || row.title || '')
          return !tStr.includes('ℹ️') && !tStr.includes('📅') && !tStr.toLowerCase().includes('tarih') && !tStr.includes('ÖRN:') && !titleStr.includes('ℹ️') && !titleStr.includes('---')
        })

        if (validRows.length === 0) return

        const dayObj = {
          id: Date.now() + Math.random(),
          label: sheetName,
          date: detectedDate,
          role: adminScheduleRole.value
        }
        newDaysArray.push(dayObj)

        validRows.forEach((row) => {
          newSessionsArray.push({
            id: Date.now() + Math.random(),
            dayId: dayObj.id,
            time: row.Time || row.time || 'TBA',
            title: row.Title || row.title || 'Untitled Session',
            speaker: row.Speaker || row.speaker || 'Not Specified',
            location: row.Location || row.location || 'Main Hall',
            role: adminScheduleRole.value
          })
        })
      })

      if (newDaysArray.length === 0 || newSessionsArray.length === 0) {
        alert('❌ Yüklenen Excel dosyasından geçerli bir veri okunamadı!')
        return
      }

      if (confirm(`✅ Çoklu Sayfa Excel başarıyla okundu!\n\n📑 ${newDaysArray.length} gün ve ${newSessionsArray.length} oturum, SADECE [ ${adminScheduleRole.value.toUpperCase()} ] veritabanına eklenecek.\n\nBuluta kaydedilsin mi?`)) {
        
        const otherRoleDays = days.value.filter(d => (d.role || 'delegates') !== adminScheduleRole.value)
        const otherRoleSessions = sessions.value.filter(s => (s.role || 'delegates') !== adminScheduleRole.value)

        days.value = [...otherRoleDays, ...newDaysArray]
        sessions.value = [...otherRoleSessions, ...newSessionsArray]

        if (sortedDays.value.length > 0) selectedDayId.value = sortedDays.value[0].id
        await saveAll()
        alert(`🚀 Harika! Yüklenen veriler başarıyla ${adminScheduleRole.value.toUpperCase()} grubuna atandı!`)
      }
    } catch (err) {
      console.error('Excel okuma hatası:', err)
      alert('❌ Excel dosyası işlenirken bir hata oluştu!')
    } finally {
      event.target.value = ''
    }
  }
  reader.readAsArrayBuffer(file)
}

const startEditingSession = (session) => {
  editingSessionId.value = session.id
  editSessionForm.dayId = session.dayId
  editSessionForm.time = session.time
  editSessionForm.title = session.title
  editSessionForm.speaker = session.speaker
  editSessionForm.location = session.location
  if (typeof window !== 'undefined') window.scrollTo({ top: 350, behavior: 'smooth' })
}

const cancelEditingSession = () => {
  editingSessionId.value = null
  editSessionForm.time = ''
  editSessionForm.title = ''
  editSessionForm.speaker = ''
  editSessionForm.location = ''
}

const updateSession = async () => {
  if (!editSessionForm.title || !editSessionForm.time) return
  const index = sessions.value.findIndex(s => s.id === editingSessionId.value)
  if (index !== -1) {
    sessions.value[index] = {
      id: editingSessionId.value,
      dayId: editSessionForm.dayId,
      time: editSessionForm.time,
      title: editSessionForm.title,
      speaker: editSessionForm.speaker || 'Not Specified',
      location: editSessionForm.location || 'Main Hall',
      role: adminScheduleRole.value
    }
    await saveAll()
    cancelEditingSession()
  }
}

const saveReminder = async () => {
  await saveAll()
  alert('✅ Daily reminder banner başarıyla güncellendi!')
}

const toggleReminderActive = async () => {
  dailyReminder.value.active = !dailyReminder.value.active
  await saveAll()
}

const checkPassword = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const res = await $fetch('/api/auth', {
      method: 'POST',
      body: { password: inputPassword.value }
    })
    if (res.success) {
      isAuthenticated.value = true
      if (typeof window !== 'undefined') localStorage.setItem('eyp_secure_auth_token', res.token)
    }
  } catch (err) {
    errorMessage.value = '❌ Şifre hatalı, erişim engellendi!'
  } finally {
    isLoading.value = false
    inputPassword.value = ''
  }
}

const logout = () => {
  isAuthenticated.value = false
  if (typeof window !== 'undefined') localStorage.removeItem('eyp_secure_auth_token')
}

function parseDateStr(dateStr) {
  if (!dateStr) return 0
  let cleaned = String(dateStr).toLowerCase().trim()
  const turkishMonths = { 'ocak':'january','şubat':'february','mart':'march','nisan':'april','mayıs':'may','haziran':'june','temmuz':'july','ağustos':'august','eylül':'september','ekim':'october','kasım':'november','aralık':'december' }
  for (const [tr, en] of Object.entries(turkishMonths)) { cleaned = cleaned.replace(tr, en) }
  return new Date(`${cleaned} 2026`).getTime() || 0
}

function parseTimeToMinutes(tStr) {
  if (!tStr) return 0
  let firstPart = String(tStr).split('-')[0].trim().replace(/\./g, ':').replace(/\s/g, '')
  if (firstPart.includes(':')) {
    const [h, m] = firstPart.split(':').map(Number)
    return (h || 0) * 60 + (m || 0)
  }
  return Number(firstPart) * 60 || 0
}

const addNewDay = async () => {
  if (newDay.label && newDay.date) {
    const newId = Date.now()
    days.value.push({ id: newId, label: newDay.label, date: newDay.date, role: adminScheduleRole.value })
    selectedDayId.value = newId
    newDay.label = ''
    newDay.date = ''
    await saveAll()
  }
}

const deleteDay = async (dayId) => {
  if (confirm('Are you sure?')) {
    days.value = days.value.filter(d => d.id !== dayId)
    sessions.value = sessions.value.filter(s => s.dayId !== dayId)
    await saveAll()
  }
}

const addSession = async () => {
  if (newSession.title && newSession.time) {
    sessions.value.push({
      id: Date.now(),
      dayId: selectedDayId.value,
      time: newSession.time,
      title: newSession.title,
      speaker: newSession.speaker || 'Not Specified',
      location: newSession.location || 'Main Hall',
      role: adminScheduleRole.value
    })
    newSession.time = ''
    newSession.title = ''
    newSession.speaker = ''
    newSession.location = ''
    await saveAll()
  }
}

const deleteSession = async (sessionId) => {
  sessions.value = sessions.value.filter(s => s.id !== sessionId)
  await saveAll()
}

const addAnnouncement = async () => {
  if (newAnnounce.title && newAnnounce.desc) {
    announcements.value.unshift({ ...newAnnounce })
    newAnnounce.title = ''
    newAnnounce.desc = ''
    newAnnounce.category = ''
    await saveAll()
  }
}

const deleteAnnouncement = async (idx) => {
  announcements.value.splice(idx, 1)
  await saveAll()
}

const deleteFeedback = async (id) => {
  feedbacks.value = feedbacks.value.filter(f => f.id !== id)
  await saveAll()
}
</script>