# Jalan Dulu 🌿

Activity discovery platform with smart gender quota management.

---

## Project Structure

```
jalan-dulu/
├── app/
│   ├── globals.css          ← fonts & global styles
│   ├── layout.js            ← HTML shell & page metadata
│   └── page.js              ← main app (sidebar + page switcher)
├── components/
│   ├── Sidebar.jsx          ← left nav, view-mode toggle, user stub
│   ├── HomeSection.jsx      ← dashboard / landing page
│   ├── DiscoverSection.jsx  ← search, filter, event list
│   ├── EventCard.jsx        ← individual event card
│   ├── DetailPanel.jsx      ← right-side event detail + booking
│   └── UI.jsx               ← shared Tag, PublicSlotBar, HostGenderBar
├── lib/
│   └── constants.js         ← colour tokens, nav items, mock event data
├── public/                  ← static assets (images, icons)
├── .gitignore
├── next.config.js
└── package.json
```

---

## Part 1 — One-Time Setup (Do this once, ever)

These are tools you install on your computer once. After this you never need to repeat these steps.

---

### Step 1 — Install VS Code

VS Code is the code editor you will use to read and edit all the project files.

1. Go to **https://code.visualstudio.com**
2. Click the big download button — it auto-detects your operating system (Windows / Mac)
3. Run the installer and follow the prompts
4. Open VS Code when it's done

**Recommended VS Code extensions to install** (makes coding much easier):

Once VS Code is open, click the **Extensions icon** on the left sidebar (it looks like 4 squares), then search for and install each of these:

| Extension | Why |
|---|---|
| **ESLint** | Highlights code mistakes as you type |
| **Prettier - Code Formatter** | Auto-formats your code when you save |
| **ES7+ React/Redux/React-Native snippets** | Shortcuts for writing React code faster |
| **Auto Rename Tag** | Renames HTML/JSX closing tag automatically |
| **GitLens** | Shows who changed what line and when |

---

### Step 2 — Install Node.js

Node.js is the engine that runs your project on your computer. Think of it like installing Java to run a Java program — your project needs Node to run.

#### For Windows:

1. Go to **https://nodejs.org/en/download**
2. Click **"Windows Installer (.msi)"** under the LTS version (LTS = stable, recommended)
3. Run the downloaded `.msi` file
4. Click **Next** through all the steps — leave everything as default
5. ✅ When it finishes, Node.js and `npm` are both installed

#### For Mac:

1. Go to **https://nodejs.org/en/download**
2. Click **"macOS Installer (.pkg)"** under the LTS version
3. Run the downloaded `.pkg` file
4. Click through the installer steps
5. ✅ When it finishes, Node.js and `npm` are both installed

#### Verify the installation worked:

After installing, open a Terminal (explained in the next step) and type:

```bash
node -v
```

You should see something like `v20.11.0`. If you do, Node.js is installed correctly.

Also run:

```bash
npm -v
```

You should see something like `10.2.4`. This is the package manager that downloads your project's libraries.

---

### Step 3 — Install Git

Git is the tool that lets you save your code history and push it to GitHub.

#### For Windows:

1. Go to **https://git-scm.com/download/win**
2. Download the installer and run it
3. Click **Next** through all steps — leave everything as default
4. ✅ Git is installed

#### For Mac:

Mac usually has Git already. Open Terminal and type `git --version`. If it asks you to install Xcode Command Line Tools, click **Install** and let it finish. That installs Git for you.

#### Verify Git is installed:

```bash
git --version
```

You should see something like `git version 2.43.0`.

---

## Part 2 — Opening the Terminal in VS Code

You will run all commands through the **integrated terminal inside VS Code** — you do not need to open a separate app.

1. Open VS Code
2. In the top menu, click **Terminal → New Terminal**
3. A panel opens at the bottom of VS Code — this is where you type commands

> **Windows note:** VS Code may open a "PowerShell" terminal by default. That's fine, all commands in this guide work in PowerShell.

---

## Part 3 — Running Jalan Dulu Locally

### Step 1 — Extract the zip file

1. Download `jalan-dulu.zip`
2. Right-click it → **Extract All** (Windows) or double-click (Mac)
3. You now have a folder called `jalan-dulu`

### Step 2 — Open the project in VS Code

Two ways to do this:

**Option A (easiest):** Drag the `jalan-dulu` folder directly onto the VS Code window.

**Option B:** In VS Code, go to **File → Open Folder** → find and select the `jalan-dulu` folder → click **Open**.

You'll see all the project files appear in the left sidebar.

### Step 3 — Open the terminal and install dependencies

1. In VS Code, open the terminal: **Terminal → New Terminal**
2. You should see the terminal path already pointing to your project folder. If not, type:
   ```bash
   cd path/to/jalan-dulu
   ```
   *(Replace `path/to/jalan-dulu` with the actual path — on Windows it might be `cd C:\Users\YourName\Downloads\jalan-dulu`)*

3. Install all the project's libraries by running:
   ```bash
   npm install
   ```
   This reads `package.json` and downloads everything into a `node_modules` folder. It takes about 30–60 seconds. You'll see a lot of text — that's normal.

### Step 4 — Start the development server

```bash
npm run dev
```

You'll see output like:
```
▲ Next.js 14.2.3
- Local: http://localhost:3000
✓ Ready in 1.2s
```

Now open **http://localhost:3000** in your browser. Your site is running! 🎉

> **Important:** Keep the terminal open while you're working. If you close the terminal, the site stops running. To stop it manually, press `Ctrl + C` in the terminal.

> **Hot reload:** Every time you save a file in VS Code (`Ctrl + S` / `Cmd + S`), the browser automatically refreshes with your changes — no need to restart anything.

---

## Part 4 — Pushing to GitHub

GitHub stores your code online so Vercel can deploy it.

### Step 1 — Create a GitHub account

Go to **https://github.com** and sign up for a free account.

### Step 2 — Create a new repository

1. After logging in, click the **+** icon (top right) → **New repository**
2. Name it `jalan-dulu`
3. Leave it as **Public** (required for free Vercel deployment)
4. Do NOT tick "Add a README file" — you already have one
5. Click **Create repository**

### Step 3 — Connect your local project to GitHub

GitHub will show you a page with commands. Ignore that and use the VS Code terminal instead.

Make sure your terminal is in the project folder, then run these commands **one by one**:

```bash
git init
```
*Initialises Git tracking in your project folder.*

```bash
git add .
```
*Stages all files to be committed. The dot (`.`) means "everything".*

```bash
git commit -m "first commit"
```
*Saves a snapshot of your code with the message "first commit".*

```bash
git branch -M main
```
*Names your main branch "main" (GitHub's default).*

```bash
git remote add origin https://github.com/YOUR_USERNAME/jalan-dulu.git
```
*Links your local folder to your GitHub repo. Replace `YOUR_USERNAME` with your actual GitHub username.*

```bash
git push -u origin main
```
*Uploads your code to GitHub.*

If it asks for your GitHub username and password, enter them. GitHub may ask you to use a **Personal Access Token** instead of your password — if so, go to GitHub → Settings → Developer Settings → Personal Access Tokens → Generate new token, tick "repo", copy the token, and paste it as the password.

✅ Refresh your GitHub repository page — you should see all your files there.

---

## Part 5 — Deploying to Vercel (Free)

### Step 1 — Create a Vercel account

1. Go to **https://vercel.com**
2. Click **Sign Up → Continue with GitHub**
3. Authorise Vercel to access your GitHub account

### Step 2 — Import your project

1. On the Vercel dashboard, click **Add New → Project**
2. You'll see your GitHub repositories listed — find `jalan-dulu` and click **Import**
3. Vercel automatically detects it's a Next.js project — leave all settings as default
4. Click **Deploy**

Vercel builds and deploys your site. This takes about 60 seconds.

✅ Your site is live at **`https://jalan-dulu.vercel.app`**

### Step 3 — Future updates (this is the easy part)

Every time you make changes to your code in VS Code and want them live, just run these commands in the terminal:

```bash
git add .
git commit -m "describe what you changed"
git push
```

Vercel detects the new push and **automatically re-deploys** within a minute. No manual steps on Vercel ever again.

---

## Part 6 — Everyday VS Code Workflow

Once everything is set up, your daily workflow looks like this:

```
1. Open VS Code → open the jalan-dulu folder
2. Terminal → New Terminal
3. Run: npm run dev
4. Open http://localhost:3000 in browser
5. Edit files in VS Code → browser auto-refreshes on save
6. When done: git add . → git commit -m "..." → git push
7. Vercel auto-deploys in ~1 min
```

---

## Next Steps (Backend)

When you're ready to connect a real database and payments:

| What | Tool | Where to start |
|------|------|----------------|
| Database | Supabase (free PostgreSQL) | supabase.com |
| Backend API | Node.js + Express | Deploy on railway.app |
| Payments | Midtrans | dashboard.midtrans.com |
| Image uploads | Cloudinary | cloudinary.com |
