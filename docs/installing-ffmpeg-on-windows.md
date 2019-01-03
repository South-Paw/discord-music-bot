# Installing [FFmpeg](https://www.ffmpeg.org/) on Windows

1. Download a static build of [FFmpeg](http://ffmpeg.zeranoe.com/builds/) for Windows.
2. Create a directory somewhere on your computer and copy the contents of the ffmpeg zip into it.
    * I suggest placing it in a place like `C:/ffmpeg`
3. You should now have a folder called `bin` inside the ffmpeg folder you've created.
    * For example; if you placed your folder at `C:/ffmpeg`, you should have a folder at `C:/ffmpeg/bin`
4. Open your Environment Variables and add the path to your ffmpeg's bin folder to the `Path` variable.
    1. Start > Search for `enviroment` > Select `Edit the system enviroment variables` > Click `Enviroment Variables...` at the bottom of the dialog
    2. Select `Path` and click `Edit` in the top section > Click `New` and enter the path (eg: `C:/ffmpeg/bin`) > Click `Ok` and `Ok`
    3. To check you've done this correctly, open command prompt or powershell and type `ffmpeg`, you should see something like [this](https://i.imgur.com/TNCc9Jb.png).

You should now have FFmpeg installed on your system and avaliable via the Path.
