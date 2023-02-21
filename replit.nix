{ pkgs }: {
    deps = [

        pkgs.nodejs-16_x
        pkgs.libwebp
        pkgs.python
        pkgs.libuuid
        pkgs.ffmpeg
        pkgs.imagemagick  
        pkgs.wget
        pkgs.git
        pkgs.yarn
    ];
  env ={
    LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [pkgs.libuuid];
  };
}




