# chainio/rust-1.97.1-amd64
#
# CI image for the Linux gates (cargo fmt / clippy / test) of Tauri v2
# desktop crates. Consumer today: the `windows_desktop_app_gates` job in
# ai-checks (WindowsDesktopApp/src-tauri).
#
# Tauri links against gtk/webkit2gtk on Linux even for a crate that never
# bundles a Linux target, so without these native dependencies `cargo
# clippy`/`cargo test` cannot compile the `tauri` crate at all. They are
# baked in here rather than apt-installed on every CI run.
#
# amd64 only — the consuming CircleCI job runs on an x86 resource class, and
# there is no arm64 consumer to justify carrying one. See the README for the
# build/push flags this image needs.
#
# The Rust version lives in this directory's name, same as the nodejs* images
# — a new toolchain is a new directory, not an edit here, so a consumer can
# move to it deliberately. There is a floor: the consumer's lockfile deps
# declare MSRVs up to 1.89 (notify-rust) and use edition2024 (icu_*), so this
# must track a recent stable. Any cimg/rust >= 1.89 works.
FROM cimg/rust:1.97.1

USER root

# Tauri v2's documented Linux build dependencies.
# `libayatana-appindicator3-dev` is the modern name for the older
# `libappindicator3-dev` package Tauri's docs also list — install whichever
# the base image carries if this ever needs adjusting.
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    libwebkit2gtk-4.1-dev \
    librsvg2-dev \
    patchelf \
    pkg-config \
    libssl-dev \
    libgtk-3-dev \
    libsoup-3.0-dev \
    libjavascriptcoregtk-4.1-dev \
    libayatana-appindicator3-dev \
  && rm -rf /var/lib/apt/lists/*

USER circleci

# The gate runs `cargo fmt --check` and `cargo clippy -- -D warnings`, so the
# components ship with the image too.
RUN rustup component add rustfmt clippy

# Fail the image build rather than a consumer's CI run if the toolchain or
# the native dependencies are not actually usable. This covers every package
# installed above: seven expose a pkg-config module, patchelf is a binary,
# and pkg-config itself is proven by the check running at all.
RUN cargo fmt --version \
  && cargo clippy --version \
  && patchelf --version \
  && pkg-config --exists \
    webkit2gtk-4.1 \
    javascriptcoregtk-4.1 \
    libsoup-3.0 \
    gtk+-3.0 \
    ayatana-appindicator3-0.1 \
    librsvg-2.0 \
    openssl
