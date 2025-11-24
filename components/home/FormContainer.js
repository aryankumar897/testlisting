"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FormContainer as StyledFormContainer, TransparentBox } from './StyledComponents';
import { formContainerVariants, transparentBoxVariants } from './animationVariants';

const FormContainer = ({ children }) => {
  return (
    <StyledFormContainer>
      <motion.div
        variants={formContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <TransparentBox
          variants={transparentBoxVariants}
          initial="hidden"
          animate="visible"
        >
          {children}
        </TransparentBox>
      </motion.div>
    </StyledFormContainer>
  );
};

export default FormContainer;