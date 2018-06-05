FROM node:6
RUN npm install -g \
        @google-cloud/functions-emulator@1.0.0-beta.4 \
        gulp-cli@2.0.1
ARG PROJECT_ID=slack-sms
ENV PROJECT_ID=${PROJECT_ID}
WORKDIR /slack-sms
COPY package.json package-lock.json /slack-sms/
RUN npm install
COPY gulpfile.js /slack-sms/
VOLUME /slack-sms/src
CMD ["/bin/bash"]
