from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
import uvicorn
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()


app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


@app.get("/")
async def name(request: Request):
    return templates.TemplateResponse("home.html", {"request": request, "name": "Nc47"})


class EmailModel(BaseModel):
    email: EmailStr
    subject: str
    message: str


@app.post("/send-email/")
async def send_email(email: EmailModel):
    sender_email = os.getenv("EMAIL_USER")
    receiver_email = os.getenv("EMAIL_USER")
    password = os.getenv("EMAIL_PASSWORD")
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = os.getenv("SMTP_PORT")

    message = MIMEMultipart("alternative")
    message["Subject"] = email.subject
    message["From"] = sender_email
    message["To"] = receiver_email

    text = f"""
    You have received a new message from {email.email}:

    Subject: {email.subject}

    Message:
    {email.message}
    """

    part = MIMEText(text, "plain")
    message.attach(part)

    try:
        server = smtplib.SMTP_SSL(smtp_server, smtp_port)
        server.login(sender_email, password)
        server.sendmail(
            sender_email, receiver_email, message.as_string()
        )
        server.quit()
        return JSONResponse(content={"success": True})

    except Exception as e:
        print(e)
        return JSONResponse(content={"success": False})

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
