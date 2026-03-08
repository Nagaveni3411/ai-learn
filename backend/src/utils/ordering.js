function flattenSubjectTree(sections) {
  const sortedSections = [...sections].sort((a, b) => a.order_index - b.order_index);
  const sequence = [];
  for (const section of sortedSections) {
    const sortedVideos = [...(section.videos || [])].sort((a, b) => a.order_index - b.order_index);
    for (const video of sortedVideos) {
      sequence.push({ ...video, section_id: section.id, section_title: section.title, subject_id: section.subject_id });
    }
  }
  return sequence;
}

function buildVideoNavigation(sequence) {
  const map = new Map();
  sequence.forEach((video, index) => {
    map.set(String(video.id), {
      previous_video_id: index > 0 ? sequence[index - 1].id : null,
      next_video_id: index < sequence.length - 1 ? sequence[index + 1].id : null
    });
  });
  return map;
}

function applyLocking(sequence, progressByVideoId) {
  return sequence.map((video, index) => {
    const prerequisiteVideoId = index > 0 ? sequence[index - 1].id : null;
    const prereqDone = prerequisiteVideoId
      ? Boolean(progressByVideoId[String(prerequisiteVideoId)]?.is_completed)
      : true;
    const locked = !prereqDone;
    return {
      ...video,
      prerequisite_video_id: prerequisiteVideoId,
      locked,
      unlock_reason: locked ? "Complete previous video" : "Unlocked"
    };
  });
}

module.exports = {
  flattenSubjectTree,
  buildVideoNavigation,
  applyLocking
};
