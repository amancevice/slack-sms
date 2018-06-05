provider "archive" {
  version = "~> 1.0"
}

provider "template" {
  version = "~> 1.0"
}

locals {
  version = "0.0.1"
}

// Slash command archive
data "archive_file" "slash_command" {
  type        = "zip"
  output_path = "${path.module}/dist/slash-command-${local.version}.zip"

  source {
    content  = "${file("${path.module}/src/slash-command/index.js")}"
    filename = "index.js"
  }

  source {
    content  = "${file("${path.module}/src/slash-command/package.json")}"
    filename = "package.json"
  }

  source {
    content  = "${file("${path.module}/src/messages.json")}"
    filename = "messages.json"
  }

  source {
    content  = "${var.config}"
    filename = "config.json"
  }
}
