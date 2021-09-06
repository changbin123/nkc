const threadSettings = NKC.methods.getDataById("threadSettings");
if(!threadSettings.isDisplay) {
  NKC.methods.initPlyrMask = () => {};
} else {
  NKC.methods.initPlyrMask = function(player) {
    if(player.type === "audio") return;
    const container = player.elements.container;
    $(container).find(".plyr__control.plyr__control--overlaid").remove();
    let maskDom = $("#plyrMask .plyr-mask").clone(false);
    let maskPlayButton = maskDom.find(".player-tip-button .play");
    let maskDownloadButton = maskDom.find(".player-tip-button .download");
    const downloadButton = $(container).find('a[data-plyr="download"]');
    const title = downloadButton.attr('data-title');
    const src = downloadButton.attr('href');
    maskDownloadButton
      .attr('href', src)
      .attr('data-type', 'download')
      .attr('data-title', title);
    maskPlayButton.on("click", () => {
      maskDom.remove();
      player.play();
    });
    // maskDownloadButton.on("click", () => NKC.methods.visitUrl(player.download, "_blank"));
    $(container).append(maskDom);
  }
}
