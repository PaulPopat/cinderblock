#include "./Frame.h"
#include "./Variable.h"
#include <vector>

namespace Storage
{
  class Closure
  {
  public:
    Closure(Frame *globals, std::vector<Frame *> frames);
    ~Closure();

    Variable *search(char *name);
    Closure *with_frame(Frame *frame);
    Closure *add_variable(char *name, Variable *value);
    Variable *search_global(char *name);

  private:
    Frame *globals;
    std::vector<Frame *> frames;
  };
}