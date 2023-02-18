{ pkgs }: {
    deps = [

        pkgs.nodejs-16_x
        pkgs.libwebp
        pkgs.python
	    pkgs.nodePackages.typescript
        pkgs.libuuid
        pkgs.ffmpeg
        pkgs.imagemagick  
        pkgs.wget
        pkgs.git
    ];
  env ={
    LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [pkgs.libuuid];
  };
}




